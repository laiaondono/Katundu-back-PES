package com.example.katundu.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
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
import com.example.katundu.ui.logged.MenuPrincipal;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {

    private FirebaseAnalytics mFirebaseAnalytics;//TODO:Esto se puede quitar?? No se para que sirve...
    private FirebaseAuth mAuth;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        //Modo Vertical
        //setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        //Oculta la barra que dice el nombre de la apliacion en la Action Bar (asi de momento)
        getSupportActionBar().hide();

        //TODO:Esto se puede quitar??
        //Firebase Anlytics de prueba
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(this);
        mAuth = FirebaseAuth.getInstance();

        final EditText usernameEditText = findViewById(R.id.username);
        final EditText passwordEditText = findViewById(R.id.password);
        final Button login_button = findViewById(R.id.login);
        final ProgressBar loadingProgressBar = findViewById(R.id.loading); //TODO:Esto se puede quitar??
        final TextView no_registrado = findViewById(R.id.no_registrado);

        login_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //desactivar login momentaneamente
                login_button.setEnabled(false);
                no_registrado.setEnabled(false);

                // Instantiate the RequestQueue.
                RequestQueue queue = Volley.newRequestQueue(LoginActivity.this);

                String url = "https://us-central1-test-8ea8f.cloudfunctions.net/login?" +
                        "un=" + usernameEditText.getText() + "&" +
                        "pw=" + passwordEditText.getText();

                // Request a string response from the provided URL.
                StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                if(response.equals("0")) { //Successful login
                                    String welcome = getString(R.string.welcome) + usernameEditText.getText().toString();
                                    Toast toast = Toast.makeText(getApplicationContext(), welcome, Toast.LENGTH_SHORT);
                                    toast.show();

                                    //FALTA PETICION A BACKEND DE LOS DATOS REALES DEL USUARIO
                                    ControladoraPresentacio.setUsername(usernameEditText.getText().toString());

                                    Intent intent = new Intent(getApplicationContext(), MenuPrincipal.class);
                                    //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                    //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    startActivity(intent);
                                    finish();
                                }
                                else if(response.equals("2")){ //Incorrect password
                                    String texterror = getString(R.string.incorrect_password);
                                    Toast toast = Toast.makeText(LoginActivity.this, texterror, Toast.LENGTH_SHORT);
                                    toast.show();
                                    //Reactivar login
                                    login_button.setEnabled(true);
                                    no_registrado.setEnabled(true);
                                }
                                else if(response.equals("1")) { //No such user!
                                    String texterror = getString(R.string.unregistered);
                                    Toast toast = Toast.makeText(LoginActivity.this, texterror, Toast.LENGTH_SHORT);
                                    toast.show();
                                    //Reactivar login
                                    login_button.setEnabled(true);
                                    no_registrado.setEnabled(true);
                                }
                                else { //response == "-1" Error getting document + err
                                    String texterror = getString(R.string.error);
                                    Toast toast = Toast.makeText(LoginActivity.this, texterror, Toast.LENGTH_SHORT);
                                    toast.show();
                                    //Reactivar login
                                    login_button.setEnabled(true);
                                    no_registrado.setEnabled(true);
                                }
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {  //TODO: aixo ho podem treure?
                        String texterror = getString(R.string.error);
                        Toast toast = Toast.makeText(LoginActivity.this, texterror, Toast.LENGTH_SHORT);
                        toast.show();
                        //Reactivar login
                        login_button.setEnabled(true);
                        no_registrado.setEnabled(true);
                    }
                });

                // Add the request to the RequestQueue.
                queue.add(stringRequest);

                //Reactivar login
                //login_button.setEnabled(true);
                //no_registrado.setEnabled(true);
            }
        });

        no_registrado.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
                //finish();
            }
        });

        //TODO: Esto se puede quitar??
        Bundle bundle = new Bundle();
        //bundle.putString(FirebaseAnalytics.Param.ITEM_ID, id);
        //bundle.putString(FirebaseAnalytics.Param.ITEM_NAME, name);
        bundle.putString(FirebaseAnalytics.Param.CONTENT_TYPE, "image");
        mFirebaseAnalytics.logEvent(FirebaseAnalytics.Event.SELECT_CONTENT, bundle);
    }
}
