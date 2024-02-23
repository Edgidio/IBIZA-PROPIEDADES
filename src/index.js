import server from "./app.js"

const port = process.env.PORT;
const host = process.env.HOST ;

server.listen(port/* , "0.0.0.0" */, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`)
})