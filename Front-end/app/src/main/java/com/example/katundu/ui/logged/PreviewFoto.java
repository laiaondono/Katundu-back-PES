package com.example.katundu.ui.logged;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;

public class PreviewFoto extends AppCompatActivity {

    ImageView preview_foto;
    int pos = ControladoraPresentacio.getNumero_imagen();
    Uri foto = ControladoraPresentacio.obtener_foto(pos);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_preview_foto);
        //Escondemos la Action Bar porque usamos la ToolBar, aunque podriamos usar la ActionBar
        getSupportActionBar().hide();

        final Button delete_Button = findViewById(R.id.button);
        final Button OK_Button = findViewById(R.id.button2);

        delete_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Borro la foto en la posicion i de la controladora
                ControladoraPresentacio.borrar_foto(pos);
                ControladoraPresentacio.reordenar_fotos();
                //Vuelvo a la ventan de Add Product
                Intent intent = new Intent(PreviewFoto.this, AddProduct.class);
                //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                finish();
            }
        });

        OK_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Intent intent = new Intent(AddProduct.this, MenuPrincipal.class);
                //startActivity(intent);
                finish();
            }
        });

        //Imagen que me pasan
        preview_foto = (ImageView)findViewById(R.id.imageView);
        preview_foto.setImageURI(foto);
    }
}
