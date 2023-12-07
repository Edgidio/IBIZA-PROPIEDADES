import server from "./app.js"
const port = 3000

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`)
})