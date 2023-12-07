import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
export const socket = {};

export const connect = (server) => {
  socket.io = new Server(server);

  socket.io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
  // Escuchar el evento desde el cliente
  socket.on('cliente_envia_evento',  async () => {
  
      // Actualizar todos los registros donde el campo visto es false
      const resultado = await db.log_sesiones.updateMany({
        where: {
          visto: false,
        },
        data: {
          visto: true,
        },
      });
      
  });
  });

};
