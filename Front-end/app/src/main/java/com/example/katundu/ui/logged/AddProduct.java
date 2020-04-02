package com.example.katundu.ui.logged;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;
import com.google.android.material.textfield.TextInputEditText;

public class AddProduct extends AppCompatActivity {

    String[] categorias = new String[7];

    Button Camara;
    ImageView PreviewFoto0, PreviewFoto1, PreviewFoto2, PreviewFoto3, PreviewFoto4;
    ImageView[] PreviewFotos;
    //HorizontalScrollView scroll_fotos;
    private static final int PERMISSION_CODE = 1000;
    private static final int IMAGE_CAPTURE_CODE = 1001;
    Uri image_uri;
    int cantidad_fotos = ControladoraPresentacio.getCantidad_fotos();
    int numero_maximo_fotos = ControladoraPresentacio.getNumero_maximo_fotos();
    Uri[] fotos = ControladoraPresentacio.getFotos();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_product);

        //Escondemos la Action Bar porque usamos la ToolBar, aunque podriamos usar la ActionBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.AddProduct_Atras);
        final Button SubirProducto = findViewById(R.id.ok_button_AddP);
        final EditText nombre = findViewById(R.id.editTextNom_AddP);
        final EditText valor = findViewById(R.id.editTextValor_AddP);
        final EditText palabras_clave = findViewById(R.id.editTextParaulesClau_AddP);
        final TextInputEditText descripcion = findViewById(R.id.editDescripcio_AddP);

        //Inicilizamos las categorias
        categorias[0] = getString(R.string.add_product_category_technology);
        categorias[1] = getString(R.string.add_product_category_home);
        categorias[2] = getString(R.string.add_product_category_beauty);
        categorias[3] = getString(R.string.add_product_category_sports);
        categorias[4] = getString(R.string.add_product_category_fashion);
        categorias[5] = getString(R.string.add_product_category_leisure);
        categorias[6] = getString(R.string.add_product_category_transport);

        //Inicializamos las fotos
        Camara = findViewById(R.id.camaraButton_AddP);
        PreviewFoto0 = findViewById(R.id.previewFoto_AddP);
        PreviewFoto1 = findViewById(R.id.previewFoto2_AddP);
        PreviewFoto2 = findViewById(R.id.previewFoto3_AddP);
        PreviewFoto3 = findViewById(R.id.previewFoto4_AddP);
        PreviewFoto4 = findViewById(R.id.previewFoto5_AddP);
        PreviewFotos = new ImageView[]{PreviewFoto0, PreviewFoto1, PreviewFoto2, PreviewFoto3, PreviewFoto4};
        for (int i = 0; i < fotos.length; ++i) {
            PreviewFotos[i].setVisibility(View.INVISIBLE);
        }
        if (cantidad_fotos > 0) {
            for (int i = 0; i < fotos.length; ++i) {
                if (fotos[i] != null) {
                    PreviewFotos[i].setVisibility(View.VISIBLE);
                    PreviewFotos[i].setImageURI(fotos[i]);
                }
            }
        }

        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddProduct.this, Add.class);
                onNewIntent(intent);
                //startActivity(intent);
                finish();
            }
        });

        SubirProducto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean okay = false;
                //Comprovaciones de que ha puesto cosas
                if (cantidad_fotos == 0) {
                    String texterror = getString(R.string.add_product_no_hay_fotos);
                    Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                    toast.show();
                } else {
                    if (nombre.length() == 0) {
                        String texterror = getString(R.string.add_product_no_hay_nombre);
                        Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                        toast.show();
                    } else {
                        if (valor.length() == 0) {
                            String texterror = getString(R.string.add_product_no_hay_valor);
                            Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                            toast.show();
                        } else {
                            if (palabras_clave.length() == 0) {
                                String texterror = getString(R.string.add_product_no_hay_palabras_clave);
                                Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                                toast.show();
                            } else {
                                if (descripcion.length() == 0) {
                                    String texterror = getString(R.string.add_product_no_hay_descripcion);
                                    Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                                    toast.show();
                                } else {
                                    okay = true;
                                }
                            }
                        }
                    }
                }
                if (okay) {
                    //Nos vamos a la ventana de User
                    Intent intent = new Intent(AddProduct.this, User.class);
                    startActivity(intent);
                    finish();
                }
            }
        });

        PreviewFoto0.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Indicamos la foto a la controladora que querremos ver
                ControladoraPresentacio.setNumero_imagen(0);
                //Nos vamos a la ventana de Preview
                Intent intent = new Intent(AddProduct.this, PreviewFoto.class);
                startActivity(intent);
                //finish();
            }
        });
        PreviewFoto1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Indicamos la foto a la controladora que querremos ver
                ControladoraPresentacio.setNumero_imagen(1);
                //Nos vamos a la ventana de Preview
                Intent intent = new Intent(AddProduct.this, PreviewFoto.class);
                startActivity(intent);
                //finish();
            }
        });
        PreviewFoto2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Indicamos la foto a la controladora que querremos ver
                ControladoraPresentacio.setNumero_imagen(2);
                //Nos vamos a la ventana de Preview
                Intent intent = new Intent(AddProduct.this, PreviewFoto.class);
                startActivity(intent);
                //finish();
            }
        });
        PreviewFoto3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Indicamos la foto a la controladora que querremos ver
                ControladoraPresentacio.setNumero_imagen(3);
                //Nos vamos a la ventana de Preview
                Intent intent = new Intent(AddProduct.this, PreviewFoto.class);
                startActivity(intent);
                //finish();
            }
        });
        PreviewFoto4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Indicamos la foto a la controladora que querremos ver
                ControladoraPresentacio.setNumero_imagen(4);
                //Nos vamos a la ventana de Preview
                Intent intent = new Intent(AddProduct.this, PreviewFoto.class);
                startActivity(intent);
                //finish();
            }
        });

        Camara.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (cantidad_fotos < numero_maximo_fotos) {
                    //If system os is >= Marshmallow
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        if (checkSelfPermission(Manifest.permission.CAMERA) ==
                                PackageManager.PERMISSION_DENIED ||
                                checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) ==
                                        PackageManager.PERMISSION_DENIED) {
                            //permission not enable, request it
                            String[] permission = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
                            //Show popup to request permissions
                            requestPermissions(permission, PERMISSION_CODE);
                        } else {
                            //permission already granmted
                            openCamera();
                        }
                    } else {
                        //System os < Marshmallow
                        openCamera();
                    }
                }
                else {
                    String texterror = getString(R.string.add_product_muchas_fotos);
                    Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
                    toast.show();
                }
            }
        });

        /* SPINNER CATEGORIAS */
        Spinner spinner = (Spinner) findViewById(R.id.spinner_AddP);
        //spinner.setAdapter(new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias));
        ArrayAdapter adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, categorias);
        //Spinner spinner = (Spinner)findViewById(R.id.spinner_AddP);
        spinner.setAdapter(adapter);
    }

    private void openCamera() {
        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.TITLE, "New Picture");
        values.put(MediaStore.Images.Media.DESCRIPTION, "From the Camera");
        image_uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        //Camera intent
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, image_uri);
        startActivityForResult(cameraIntent, IMAGE_CAPTURE_CODE);
    }

    //handling permission result
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        //this method is callled when user presses Allow or Deny from Permission Request PopUp
        if (cantidad_fotos < numero_maximo_fotos) {
            switch (requestCode) {
                case PERMISSION_CODE: {
                    if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                        //permission from popup was garanted
                        openCamera();
                    } else {
                        Toast.makeText(this, "Permission denied...", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        }
        else {
            String texterror = getString(R.string.add_product_muchas_fotos);
            Toast toast = Toast.makeText(AddProduct.this, texterror, Toast.LENGTH_SHORT);
            toast.show();
        }
    }

    @SuppressLint("MissingSuperCall")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //called when image was captured from camera
        if (resultCode == RESULT_OK) {
            //set the image captured to our ImageView
            //int longitud = fotos.length;
            int longitud = ControladoraPresentacio.getFotos().length;
            int i = 0;
            boolean foto_subida_con_exito = false;
            while ((i < longitud) && (foto_subida_con_exito == false)) {
                if (fotos[i] == null) {
                    PreviewFotos[i].setImageURI(image_uri);
                    PreviewFotos[i].setVisibility(View.VISIBLE);
                    //Actualizamos la controladora
                    ControladoraPresentacio.add_foto(image_uri, i);
                    fotos = ControladoraPresentacio.getFotos();
                    cantidad_fotos = ControladoraPresentacio.getCantidad_fotos();
                    //Salimos del bucle
                    foto_subida_con_exito = true;
                }
                else {
                    //Siguiente hueco de foto
                    ++i;
                }
            }
        }
    }
}
