package com.example.katundu.ui.logged;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.katundu.R;
import com.example.katundu.ui.ControladoraPresentacio;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class Add extends AppCompatActivity {


    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    ControladoraPresentacio.reset_fotos();
                    Intent intent = new Intent(Add.this, MenuPrincipal.class);
                    //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                    onNewIntent(intent);
                    overridePendingTransition(0,0);
                    finish();
                    //startActivity(intent);
                    return true;
                case R.id.navigation_surprise:
                    return true;
                case R.id.navigation_add:
                    //mTextMessage.setText(R.string.title_notifications);
                    return true;
                case R.id.navigation_xat:
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add);
        //Escondemos la Action Bar
        getSupportActionBar().hide();

        //Barra Navegacio en ADD
        BottomNavigationView navView = findViewById(R.id.nav_view_add);
        navView.setSelectedItemId(R.id.navigation_add);
        navView.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);

        final Button add_product = findViewById(R.id.addProduct_add);
        final Button add_wish = findViewById(R.id.addWish_add);

        add_product.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ControladoraPresentacio.reset_fotos();
                Intent intent = new Intent(Add.this, AddProduct.class);
                startActivity(intent);
                //finish();
            }
        });

        add_wish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Add.this, AddWish.class);
                startActivity(intent);
                //finish();
            }
        });
    }
}
