package com.gongsik.gsw.categories.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/categories")
public class CategoriesController {
	
	@GetMapping("/itemList")
	public String categories(@RequestParam(name = "menuItemNo", required = false) String menuItemNo, @RequestParam(name = "menuNm", required = false) String menuNm, Model model) {
		model.addAttribute("menuItemNo", menuItemNo);
		model.addAttribute("menuNm", menuNm);
		return "categories/categorie";
	}
}
