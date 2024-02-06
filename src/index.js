import server from "./app.js"
const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`)
})