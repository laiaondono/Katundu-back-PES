package com.example.katundu.ui;

public class ControladoraPresentacio {
    private static String username = "testusername";
    private static String nom_real = "testname";
    private static String password = "password";
    private static String latitud = "0.0";
    private static String longitud = "0.0";
    private static double valoracion = 4;

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
}
