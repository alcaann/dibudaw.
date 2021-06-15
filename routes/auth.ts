import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as user from 'models/user';
import * as mongoose from 'mongoose';
import * as cryptoJS from 'crypto-js';
import { secretKey } from 'models/user';
import * as nodemailer from 'nodemailer';
var userMailer:string = /* email que mandará los correos de bienvenida */;
var userPass:string = /* contraseña del email que mandará los correos de bienvenida */;

const transportes = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: userMailer,
    pass: userPass
  }
});

function welcomeMail(pReceiver:string, pUsername:string){
  let emailData =  {
    from: userMailer,
    to: pReceiver ,
    subject: 'Bienvenido a dibudaw, ' +  pUsername + '!',
    html: `<style>
    ul:before{
      content:attr(aria-label);
      font-size:120%;
      font-weight:bold;
      margin-left:-20px;
    margin-bottom:20px;
  }
    </style>
  <body style="background-color: #8425A9 ">
  
  <table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">
  
    <tr>
      <td style="background-color: #ecf0f1">
        <div style="color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif">
          <h2 style="color: #531CB6; margin: 0 0 7px">Hola `+pUsername+`!</h2>
          <h3 style="color: #531CB6; margin: 0 0 12px">El equipo de Dibudaw te da la bienvenida.</h3>
          <p style="margin: 2px; font-size: 15px">
            Su cuenta ha sido registrada con éxito, y ya dispone de todo el acceso en nuestra web.</p>
          
          
        <ul aria-label="Consejos!">
   
      <li style="font-size:14px; margin-top:2px">Añade a tus amigos.</li>
      <li style="font-size:14px">Crea una sala.</li>
      <li style="font-size:14px">Comienza la partida!</li>
  </ul>
          <br>
          <div style="width: 100%; text-align: center">
            <a style="text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color: #3498db" href="">Ir a la página</a>	
          </div>
          <p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">Dibudaw 2021</p>
        </div>
      </td>
    </tr>
  </table>
  `
  }
  transportes.sendMail(emailData);
}
const RSA_PRIVATE_KEY = /* RSA PRIVATE KEY */;
const router: express.Router = express.Router();

router.post('/login', async (req: express.Request, res: express.Response) => {
  let loginResult = await user.login(req.body.email, req.body.password, secretKey);
  if (loginResult.status) {
    let vUser = await user.findByEmail(req.body.email);
    if (vUser != null) {
      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '365d',
        subject: vUser.id.toString()
      });
      var now = new Date();
      res.set('Access-Control-Allow-Credentials', 'true');
      res.cookie('session', jwtBearerToken, {
        expires: new Date(now.getFullYear() + 1, now.getMonth(), 0), httpOnly: true
      });
      res.json({ status: 'valid', reason: loginResult.reason });
    }
    else {
      res.json({ status: 'invalid credentials', reason: loginResult.reason });
    }
  }
  else {
    res.json({ status: 'invalid credentials', reason: loginResult.reason });
  }
});


router.get('/logout', (req: express.Request, res: express.Response) => {
  res.cookie('session', {}, { expires: new Date() });
  res.json({ status: 'logged out', reason: 'Se ha cerrado sesión correctamente.' });
});

router.post('/register', async (req: express.Request, res: express.Response) => {
  let registerResult = await user.register(req.body.username, req.body.email, req.body.password, secretKey);
  if (registerResult.status) {
    res.json({ status: "registered", reason: registerResult.reason });
    welcomeMail(req.body.email, req.body.username)
  } else {
    res.json({ status: "no registered", reason: registerResult.reason });
  }
});

router.get('/status', async (req: express.Request, res: express.Response) => {

  if (req.cookies['session']) {
    await jwt.verify(req.cookies['session'], RSA_PRIVATE_KEY, {
      algorithms: ['RS256']
    }, async (err: any, decoded: any) => {
      if (err) {
        console.log(err);
        res.json({ status: 'error',  })
      }
      else {
        res.json({ status: 'connected', user: await user.findById(decoded.sub) });
      }
    });
  }
  else {
    res.json({ status: 'disconnected' })
  }
});





export default router;
