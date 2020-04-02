package com.example.katundu.ui.logged;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;
import com.google.android.material.bottomnavigation.BottomNavigationView;


public class User extends AppCompatActivity {

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_wish_list:
                    Intent intent = new Intent(User.this, ListWish.class);
                    //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    //onNewIntent(intent);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                    startActivity(intent);
                    overridePendingTransition(0,0);
                    finish();

                    //Si lo hacemos con ventanas independientes, quitamos los TRUES
                    return true;
                case R.id.navigation_own_list:
                    return true;
                case R.id.navigation_fav_list:
                    return true;
            }
            return false;
        }
    };

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);
        //Escondemos la Action Bar porque usamos la ToolBar
        getSupportActionBar().hide();

        final TextView NomUsuari = findViewById(R.id.nomUsuari);
        final ImageView ImgSettings = findViewById(R.id.img_settings);
        final ImageView Atras = findViewById(R.id.User_Atras);
        //USERNAME DEL USUARIO
        NomUsuari.setText(ControladoraPresentacio.getUsername());

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User.this, MenuPrincipal.class);
                //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                onNewIntent(intent);
                //startActivity(intent);
                finish();
            }
        });

        ImgSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User.this, Ajustes.class);
                startActivity(intent);
                //finish();
            }
        });

        //Valoracion Usuario
        final TextView valoracion_usuario = findViewById(R.id.textView_valoracio_numero_User);
        valoracion_usuario.setText(Double.toString(ControladoraPresentacio.getValoracion()));
        final ImageView star1 = findViewById(R.id.imageViewStar1_User);
        final ImageView star2 = findViewById(R.id.imageViewStar2_User);
        final ImageView star3 = findViewById(R.id.imageViewStar3_User);
        final ImageView star4 = findViewById(R.id.imageViewStar4_User);
        final ImageView star5 = findViewById(R.id.imageViewStar5_User);
        ImageView[] stars = {star1, star2, star3, star4, star5};
        int valoracion = (int)ControladoraPresentacio.getValoracion();
        for (int i=0; i<valoracion; ++i) {
            stars[i].setImageTintList(ColorStateList.valueOf(Color.parseColor("#FFFFFF")));
        }

        //Barra Navegacio Llistes
        BottomNavigationView navView = findViewById(R.id.nav_view);
        navView.setSelectedItemId(R.id.navigation_own_list);
        //navView.setItemIconTintList(ColorStateList.valueOf(Color.parseColor("#FFFFFF")));
        navView.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);


        //Esto se descomentara si sabemos volver a atras de forma "inteligente"
        //Si no gusta se comenta y listo
        NomUsuari.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User.this, EditarPerfil.class);
                startActivity(intent);
                //finish();
            }
        });

    }
}

