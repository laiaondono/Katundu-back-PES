package com.example.katundu.ui.logged;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;

public class EditWish extends AppCompatActivity {

    String[] categorias = new String[7];

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_wish);
        //Escondemos la Action Bar porque usamos la ToolBar, aunque podriamos usar la ActionBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.EditWish_Atras);
        final Button Modify_Wish = findViewById(R.id.ok_button_EditWish);
        final EditText nombre = findViewById(R.id.editTextNom_EditWish);
        final Switch tipo_deseo = findViewById(R.id.switch_wish_EW);
        final EditText palabras_clave = findViewById(R.id.editTextParaulesClau_EditWish);

        //Inicilizamos las categorias
        categorias[0] = getString(R.string.add_product_category_technology);
        categorias[1] = getString(R.string.add_product_category_home);
        categorias[2] = getString(R.string.add_product_category_beauty);
        categorias[3] = getString(R.string.add_product_category_sports);
        categorias[4] = getString(R.string.add_product_category_fashion);
        categorias[5] = getString(R.string.add_product_category_leisure);
        categorias[6] = getString(R.string.add_product_category_transport);
        /* SPINNER CATEGORIAS */
        Spinner spinner = (Spinner) findViewById(R.id.spinner_EditWish);
        //spinner.setAdapter(new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias));
        ArrayAdapter adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias);
        //Spinner spinner = (Spinner)findViewById(R.id.spinner_AddP);
        spinner.setAdapter(adapter);

        //Inicializamos los editText con nuestros datos
        //TODO: Ahora hay datos random para probar, pero hay que hacerlo bien
        nombre.setText(ControladoraPresentacio.getWish_name());
        spinner.setSelection(ControladoraPresentacio.getWish_Categoria()); //esto es para cambiar el elemento seleccionado por defecto del spinner
        tipo_deseo.setChecked(ControladoraPresentacio.isWish_Service()); //esto es para cambiar el switch
        palabras_clave.setText(ControladoraPresentacio.getWish_PC());

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(EditWish.this, ListWish.class);
                onNewIntent(intent);
                //startActivity(intent);
                finish();
            }
        });

        Modify_Wish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean okay = false;
                //Comprovaciones de que ha puesto cosas
                if (nombre.length() == 0) {
                    String texterror = getString(R.string.add_product_no_hay_nombre);
                    Toast toast = Toast.makeText(EditWish.this, texterror, Toast.LENGTH_SHORT);
                    toast.show();
                } else {
                    if (palabras_clave.length() == 0) {
                        String texterror = getString(R.string.add_product_no_hay_palabras_clave);
                        Toast toast = Toast.makeText(EditWish.this, texterror, Toast.LENGTH_SHORT);
                        toast.show();
                    } else {
                        okay = true;
                    }
                }
                if (okay) {
                    //Nos vamos a la ventana de User
                    Intent intent = new Intent(EditWish.this, User.class);
                    onNewIntent(intent);
                    //startActivity(intent);
                    finish();
                }
            }
        });
    }
}
