package com.example.katundu.ui;

import android.net.Uri;

public class ControladoraPresentacio {
    //datos usuario
    private static String username = "testusername";
    private static String nom_real = "testname";
    private static String password = "password";
    private static String latitud = "0.0";
    private static String longitud = "0.0";
    //idioma usuario (temporal)
    private static String idioma = "";
    //add product
    private static double valoracion = 4;
    private static int numero_imagen = -1;
    private static int cantidad_fotos = 0;
    private static int numero_maximo_fotos = 5;
    private static Uri[] fotos = new Uri[numero_maximo_fotos];
    //modificar wish
    private static String wish_name = "Audi";
    private static int wish_categoria = 5;
    private static boolean wish_service = false;
    private static String wish_PC = "Coche";

    public static String getUsername() {
        return username;
    }

    public static void setUsername(String username) {
        ControladoraPresentacio.username = username;
    }

    public static String getNom_real() {
        return nom_real;
    }

    public static void setNom_real(String nom_real) {
        ControladoraPresentacio.nom_real = nom_real;
    }

    public static String getPassword() {
        return password;
    }

    public static void setPassword(String password) {
        ControladoraPresentacio.password = password;
    }

    public static String getLatitud() {
        return latitud;
    }

    public static void setLatitud(String latitud) {
        ControladoraPresentacio.latitud = latitud;
    }

    public static String getLongitud() {
        return longitud;
    }

    public static void setLongitud(String longitud) {
        ControladoraPresentacio.longitud = longitud;
    }

    public static double getValoracion() {
        return valoracion;
    }

    public static void setValoracion(double valoracion) {
        ControladoraPresentacio.valoracion = valoracion;
    }

    public static int getNumero_imagen() {
        return numero_imagen;
    }

    public static void setNumero_imagen(int numero_imagen) {
        ControladoraPresentacio.numero_imagen = numero_imagen;
    }

    public static int getCantidad_fotos() {
        return cantidad_fotos;
    }

    public static void setCantidad_fotos(int cantidad_fotos) {
        ControladoraPresentacio.cantidad_fotos = cantidad_fotos;
    }

    public static int getNumero_maximo_fotos() {
        return numero_maximo_fotos;
    }

    public static Uri[] getFotos() {
        return fotos;
    }

    public static void setFotos(Uri[] foto) {
        ControladoraPresentacio.fotos = foto;
    }

    public static Uri obtener_foto(int i) {
        //"i" empieza en 0
        Uri foto = fotos[i];
        return foto;
    }

    public static void add_foto(Uri photo, int pos) {
        //"i" empieza en 0
        fotos[pos] = photo;
        ++cantidad_fotos;
    }

    public static void borrar_foto(int i) {
        //"i" empieza en 0
        fotos[i] = null;
        if (cantidad_fotos > 0) --cantidad_fotos;
    }

    public static void reset_fotos() {
        //"i" empieza en 0
        numero_imagen = 1;
        cantidad_fotos = 0;
        fotos = new Uri[numero_maximo_fotos];
    }

    public static void reordenar_fotos() {
        Uri[] actualizada = new Uri[numero_maximo_fotos];
        int new_pos = 0;
        for (int i=0; i<numero_maximo_fotos; ++i) {
            if (fotos[i] != null) {
                actualizada[new_pos] = fotos[i];
                ++new_pos;
            }
        }
        fotos = actualizada;
    }

    public static String getWish_name() {
        return wish_name;
    }

    public static void setWish_name(String wish_name) {
        ControladoraPresentacio.wish_name = wish_name;
    }

    public static int getWish_Categoria() {
        return wish_categoria;
    }

    public static void setWish_Categoria(int categoria) {
        ControladoraPresentacio.wish_categoria = categoria;
    }

    public static boolean isWish_Service() {
        return wish_service;
    }

    public static void setWish_Service(boolean service) {
        ControladoraPresentacio.wish_service = service;
    }

    public static String getWish_PC() {
        return wish_PC;
    }

    public static void setWish_PC(String wish_PC) {
        ControladoraPresentacio.wish_PC = wish_PC;
    }

    public static String getIdioma() {
        return idioma;
    }

    public static void setIdioma(String idioma) {
        ControladoraPresentacio.idioma = idioma;
    }
}
