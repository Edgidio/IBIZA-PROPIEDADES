addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    try {
      const { nombre, correo, asunto, mensaje } = await request.json();
  
      // Configura el correo electrónico
      const emailBody = `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`;
      const emailSubject = asunto || 'Nuevo registro de usuario';
  
      // Envía el correo electrónico
      await enviarCorreo(emailSubject, emailBody);
  
      return new Response('Correo enviado correctamente', { status: 200 });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      return new Response('Error al procesar la solicitud', { status: 500 });
    }
  }
  
  async function enviarCorreo(asunto, cuerpo) {
    const correoDestino = 'administrador@ibizapropiedades.com.ve';
  
    // Realiza una solicitud POST a un servicio externo que pueda enviar correos
    const servicioCorreoEndpoint = 'URL_DEL_SERVICIO_DE_CORREO'; // Reemplaza con la URL de tu servicio
    const response = await fetch(servicioCorreoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: correoDestino,
        subject: asunto,
        body: cuerpo,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Error al enviar el correo: ${response.statusText}`);
    }
  }