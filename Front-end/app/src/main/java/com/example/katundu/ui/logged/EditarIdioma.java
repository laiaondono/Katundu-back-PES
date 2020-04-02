package com.example.katundu.ui.logged;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;

import java.util.Locale;

public class EditarIdioma extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editar_idioma);
        //Escondemos la Action Bar porque usamos la ToolBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.EditarIdioma_Atras);
        final Button Guardar_idioma = findViewById(R.id.save_idioma);
        final RadioGroup idiomasDisponibles = findViewById(R.id.idiomas_disponibles);
        final RadioButton espanol = findViewById(R.id.idioma_esp);
        final RadioButton catalan = findViewById(R.id.idioma_cat);
        final RadioButton ingles = findViewById(R.id.idioma_eng);

        //Inicializamos con el idioma del usuario en este momento
        //TODO: Añadir 2h al PRT
        switch (ControladoraPresentacio.getIdioma()) {
        //switch (Locale.getDefault().getLanguage()) {
            case "es":
                espanol.setChecked(true);
                break;
            case "ca":
                catalan.setChecked(true);
                break;
            case "en":
                ingles.setChecked(true);
                break;
        }

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(EditarIdioma.this, Ajustes.class);
                onNewIntent(intent);
                //startActivity(intent);
                finish();
            }
        });

        Guardar_idioma.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Ahora si hacemos el cambio
                //TODO: No funciona el catalan
                Locale localizacion = new Locale("es");
                System.out.println(idiomasDisponibles.getCheckedRadioButtonId());
                switch (idiomasDisponibles.getCheckedRadioButtonId()) {
                    case 2131230914:
                        ControladoraPresentacio.setIdioma("es");
                        localizacion = new Locale("es");
                        break;
                    case 2131230912:
                        ControladoraPresentacio.setIdioma("ca");
                        localizacion = new Locale("ca");
                        break;
                    case 2131230913:
                        ControladoraPresentacio.setIdioma("en");
                        localizacion = new Locale("en");
                        break;
                }
                Locale.setDefault(localizacion);
                Configuration config = new Configuration();
                config.locale = localizacion;
                getBaseContext().getResources().updateConfiguration(config, getBaseContext().getResources().getDisplayMetrics());

                //"Reiniciamos" y vamos a menuPrincipal
                Intent intent = new Intent(EditarIdioma.this, MenuPrincipal.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                //finish();
            }
        });
    }
}
