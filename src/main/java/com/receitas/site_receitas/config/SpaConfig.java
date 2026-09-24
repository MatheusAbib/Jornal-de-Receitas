package com.receitas.site_receitas.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaConfig {

    @GetMapping(value = {
        "/{path:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
