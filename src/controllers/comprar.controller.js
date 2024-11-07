import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

import { lenguaje } from "../helpers/languaje.js";

export const casa = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.casa.json")

      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'C',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/casas', {
        Titulo: "Ibiza Propiedades | Casas",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const apartamento = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.apartamento.json")
  

      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'A',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/apartamentos', {
        Titulo: "Ibiza Propiedades | Apartamentos",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const local_comercial = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.local_comercial.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'L',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/local-comercial', {
        Titulo: "Ibiza Propiedades | Locales comercial",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const oficina = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.oficina.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'O',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/oficinas', {
        Titulo: "Ibiza Propiedades | Oficinas",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const edificio = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.edificio.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'E',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/edificios', {
        Titulo: "Ibiza Propiedades | Edificios",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const terreno = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.terreno.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'T',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/terrenos', {
        Titulo: "Ibiza Propiedades | Terrenos",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const penthouses = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.terreno.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'P',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/penthouses', {
        Titulo: "Ibiza Propiedades | penthouses",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const townhouses = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.terreno.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'H',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/townhouses', {
        Titulo: "Ibiza Propiedades | townhouses",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const galpones = async (req, res) => {

    try {

      const t = await lenguaje(req, "comprar.terreno.json")
  
      const propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'G',
          venta_renta: 'V',
        },
        include: {
          fotos: true,
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
        return {
          id: propiedad.id,
          id_propietario: propiedad.id_propietario,
          descripcion: propiedad.descripcion,
          detalles: propiedad.detalles,
          ubicacion: propiedad.ubicacion,
          precio: propiedad.precio,
          venta_renta: propiedad.venta_renta,
          n_habitaciones: propiedad.n_habitaciones,
          n_banos: propiedad.n_banos,
          superficie: propiedad.superficie,
          terreno: propiedad.terreno,
          tipo_propiedad: propiedad.tipo_propiedad,
          vendida: propiedad.vendida,
          createdAt: propiedad.createdAt,
          updatedAt: propiedad.updatedAt,
          usuarioId: propiedad.usuarioId,
          estado: propiedad.estado,
          rutas: primeraRuta,
        };
      });
      
  
      res.render('partials/frontend/comprar/galpones', {
        Titulo: "Ibiza Propiedades | galpones",
        rutaIF: "Frontend",
        propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
        t
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };