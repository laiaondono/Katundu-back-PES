package com.example.katundu.ui.logged;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;

public class AddProduct extends AppCompatActivity {

    String[] categorias = {"Tecnología","Hogar","Belleza","Deportes","Moda","Ocio"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_product);

        //Escondemos la Action Bar porque usamos la ToolBar, aunque podriamos usar la ActionBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.AddProduct_Atras);
        final Button SubirProducto = findViewById(R.id.ok_button_AddP);
        final Button Camara = findViewById(R.id.imageButton_AddP);
        final TextView DeleteAccount = findViewById(R.id.textViewDeleteAccount);;

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddProduct.this, MenuPrincipal.class);
                startActivity(intent);
                finish();
            }
        });

        SubirProducto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddProduct.this, User.class);
                startActivity(intent);
                finish();
            }
        });

        /* SPINNER CATEGORIAS */
        Spinner spinner = (Spinner) findViewById(R.id.spinner_AddP);
        //spinner.setAdapter(new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias));
        ArrayAdapter adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias);
        //Spinner spinner = (Spinner)findViewById(R.id.spinner_AddP);
        spinner.setAdapter(adapter);
    }
}
