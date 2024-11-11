import { IncomingMessage, ServerResponse } from 'http'
import { signin, signup } from '../controlers/authControllers'

export const authRoutes = (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/api/signup' && req.method === 'POST') {
        signup(req, res)
    } else if (req.url === '/api/signin' && req.method === 'POST') {
        signin(req, res)
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
    }
}