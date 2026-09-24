package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.service.CarrosselService;
import com.receitas.site_receitas.service.UploadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrossel")
@Tag(name = "Carrossel", description = "Endpoints REST do carrossel")
public class CarrosselController {

    @Autowired
    private CarrosselService carrosselService;

    @Autowired
    private UploadService uploadService;

    @Operation(
        summary = "Listar itens ativos do carrossel",
        description = "Retorna todos os itens ativos do carrossel, ordenados por ordem de exibição. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Itens retornados com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"itens\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"imagemUrl\": \"https://exemplo.com/img.png\", \"ativo\": true, \"ordemExibicao\": 1}]}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar carrossel\"}")
            )
        )
    })
    @GetMapping
    public ResponseEntity<?> listarAtivos() {
        try {
            List<CarrosselItem> itens = carrosselService.listarAtivos();
            return ResponseEntity.ok(Map.of("itens", itens));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao listar carrossel"));
        }
    }

    @Operation(
        summary = "Listar todos os itens (admin)",
        description = "Retorna todos os itens do carrossel (ativos e inativos). Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Itens retornados com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"itens\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"ativo\": true}, {\"id\": 2, \"titulo\": \"Salada Tropical\", \"ativo\": false}]}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar carrossel\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/admin")
    public ResponseEntity<?> listarTodos() {
        try {
            List<CarrosselItem> itens = carrosselService.listarTodos();
            return ResponseEntity.ok(Map.of("itens", itens));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao listar carrossel"));
        }
    }

    @Operation(
        summary = "Adicionar item ao carrossel",
        description = "Adiciona um novo item ao carrossel. Aceita upload de imagem via multipart/form-data. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Item adicionado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Item adicionado com sucesso\", \"item\": {\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"ativo\": true}}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao adicionar item\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping(value = "/adicionar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> adicionarItem(
            @Parameter(description = "Dados do item do carrossel")
            @ModelAttribute CarrosselItem carrosselItem,

            @Parameter(description = "Arquivo de imagem do item (opcional)")
            @RequestParam(value = "imagemFile", required = false)
            MultipartFile imagemFile) throws Exception {

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        if (nomeArquivo != null) {
            carrosselItem.setImagemUrl(nomeArquivo);
        }

        CarrosselItem salvo = carrosselService.salvar(carrosselItem);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Item adicionado com sucesso", "item", salvo));
    }

    @Operation(
        summary = "Editar item do carrossel",
        description = "Atualiza os dados de um item existente do carrossel. Aceita upload de nova imagem. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Item atualizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Item atualizado com sucesso\", \"item\": {\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"ativo\": true}}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao atualizar item\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping(value = "/editar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editarItem(
            @Parameter(description = "ID do item do carrossel", required = true, example = "1")
            @PathVariable Long id,

            @Parameter(description = "Dados atualizados do item")
            @ModelAttribute CarrosselItem itemAtualizado,

            @Parameter(description = "Nova imagem do item (opcional)")
            @RequestParam(value = "imagemFile", required = false)
            MultipartFile imagemFile) throws Exception {

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        if (nomeArquivo != null) {
            itemAtualizado.setImagemUrl(nomeArquivo);
        }

        CarrosselItem atualizado = carrosselService.atualizar(id, itemAtualizado);

        return ResponseEntity.ok(Map.of("message", "Item atualizado com sucesso", "item", atualizado));
    }

    @Operation(
        summary = "Alternar status do item",
        description = "Alterna entre ativo e inativo um item do carrossel. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Status alterado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Status alterado com sucesso\", \"item\": {\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"ativo\": false}}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao alterar status\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/toggle/{id}")
    public ResponseEntity<?> toggleAtivo(
            @Parameter(description = "ID do item do carrossel", required = true, example = "1")
            @PathVariable Long id) {
        CarrosselItem item = carrosselService.alternarAtivo(id);
        return ResponseEntity.ok(Map.of("message", "Status alterado com sucesso", "item", item));
    }

    @Operation(
        summary = "Excluir item do carrossel",
        description = "Remove permanentemente um item do carrossel. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Item excluído com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Item excluído com sucesso\"}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao excluir item\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/excluir/{id}")
    public ResponseEntity<?> excluirItem(
            @Parameter(description = "ID do item a ser excluído", required = true, example = "1")
            @PathVariable Long id) {
        carrosselService.excluir(id);
        return ResponseEntity.ok(Map.of("message", "Item excluído com sucesso"));
    }
}
