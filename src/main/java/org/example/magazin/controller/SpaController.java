package org.example.magazin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
            "/cart", "/orders", "/admin",
            "/admin/**",
            "/product/**"
    })
    public String spaRedirect() {
        return "forward:/index.html";
    }
}
