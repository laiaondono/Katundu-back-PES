package com.example.katundu.ui.logged;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.login.LoginActivity;

public class Ajustes extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ajustes);
        //Escondemos la Action Bar porque usamos la ToolBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.DeleteAccount_Atras);
        final Button ModificarPerfil = findViewById(R.id.modificar_perfil);
        final Button CambiarIdioma = findViewById(R.id.modificar_idioma);
        final Button Logout = findViewById(R.id.logout);
        final TextView DeleteAccount = findViewById(R.id.textViewDeleteAccount);

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Cuidado porque vuelve a User no a la ventana que me invoca
                Intent intent = new Intent(Ajustes.this, User.class);
                onNewIntent(intent);
                //startActivity(intent);
                finish();
            }
        });

        ModificarPerfil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Ajustes.this, EditarPerfil.class);
                startActivity(intent);
                //finish();
            }
        });

        CambiarIdioma.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent refresh = new Intent(Ajustes.this, EditarIdioma.class);
                startActivity(refresh);
                //finish();
            }
        });

        Logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //FALTA HACER LOGOUT DE VERDAD
                Intent intent = new Intent(Ajustes.this, LoginActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                //finish();
            }
        });

        DeleteAccount.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Ajustes.this, DeleteAccount.class);
                startActivity(intent);
                //finish();
            }
        });
    }
}
