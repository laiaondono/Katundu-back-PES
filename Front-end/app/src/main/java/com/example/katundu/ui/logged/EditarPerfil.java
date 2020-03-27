package com.example.katundu.ui.logged;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;

public class EditarPerfil extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editar_perfil);
        //Escondemos la Action Bar porque usamos la ToolBar
        getSupportActionBar().hide();

        final ImageView Atras = findViewById(R.id.DeleteAccount_Atras);
        final Button SaveButton = findViewById(R.id.save_button);
        final TextView usernameEditText = findViewById(R.id.TextNomUsuari);
        final EditText nameEditText = findViewById(R.id.editTextNom);
        final EditText passwordEditText = findViewById(R.id.editTextContrasenya);
        final EditText latitudeEditText = findViewById(R.id.editTextLatitud);
        final EditText longitudeEditText = findViewById(R.id.editTextLongitud);
        //final EditText birthDateEditText = findViewById(R.id.editTextBirthDate);

        //DATOS DEL USUARIO
        usernameEditText.setText(ControladoraPresentacio.getUsername());
        nameEditText.setText(ControladoraPresentacio.getNom_real());
        passwordEditText.setText(ControladoraPresentacio.getPassword());
        latitudeEditText.setText(ControladoraPresentacio.getLatitud());
        longitudeEditText.setText(ControladoraPresentacio.getLongitud());
        //birthDateEditText.setText(ControladoraPresentacio.getUsername());


        Atras.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(EditarPerfil.this, Ajustes.class);
                startActivity(intent);
                finish();
            }
        });

        SaveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Instantiate the RequestQueue.
                RequestQueue queue = Volley.newRequestQueue(EditarPerfil.this);

                String url = "https://us-central1-test-8ea8f.cloudfunctions.net/modify_personal_credentials?" +
                        "un=" + usernameEditText.getText() + "&" +
                        "pw=" + passwordEditText.getText() + "&" +
                        "n=" + nameEditText.getText() + "&" +
                        "lat=" + latitudeEditText.getText() + "&" +
                        "lon=" + longitudeEditText.getText();

                // Request a string response from the provided URL.
                StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                System.out.println(response);
                                if(response.equals("0")) { //Account modified successfully
                                    String account_modified_successfully = getString(R.string.account_modified_successfully);
                                    Toast toast = Toast.makeText(getApplicationContext(), account_modified_successfully, Toast.LENGTH_SHORT);
                                    toast.show();

                                    //Actualizamos Controladora
                                    ControladoraPresentacio.setUsername(usernameEditText.getText().toString());
                                    ControladoraPresentacio.setPassword(passwordEditText.getText().toString());
                                    ControladoraPresentacio.setNom_real(nameEditText.getText().toString());
                                    ControladoraPresentacio.setLatitud(latitudeEditText.getText().toString());
                                    ControladoraPresentacio.setLongitud(longitudeEditText.getText().toString());
                                    //Volvemos a Ajustes
                                    Intent intent = new Intent(EditarPerfil.this, Ajustes.class);
                                    startActivity(intent);
                                    finish();
                                }
                                else { //response == "1" No such user in the database
                                    String texterror = getString(R.string.error);
                                    Toast toast = Toast.makeText(EditarPerfil.this, texterror, Toast.LENGTH_SHORT);
                                    toast.show();
                                }
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {  //TODO: aixo ho podem treure?
                        String texterror = getString(R.string.error);
                        Toast toast = Toast.makeText(EditarPerfil.this, texterror, Toast.LENGTH_SHORT);
                        toast.show();
                    }
                });

                // Add the request to the RequestQueue.
                queue.add(stringRequest);
            }
        });
    }
}

