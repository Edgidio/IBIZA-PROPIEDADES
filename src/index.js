import server from "./app.js"

const port = process.env.PORT;
const host = process.env.HOST ;

server.listen(port, host, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`)
})