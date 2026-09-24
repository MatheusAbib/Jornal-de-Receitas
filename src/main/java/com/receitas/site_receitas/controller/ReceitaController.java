package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.command.AprovarReceitaCommand;
import com.receitas.site_receitas.command.Command;
import com.receitas.site_receitas.command.CommandInvoker;
import com.receitas.site_receitas.command.ExcluirReceitaCommand;
import com.receitas.site_receitas.command.RejeitarReceitaCommand;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.factory.ReceitaFactory;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UploadService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/receitas")
@Tag(name = "Receitas", description = "Endpoints REST de receitas")
public class ReceitaController {

    private final ReceitaService receitaService;
    private final UsuarioService usuarioService;

    @Autowired
    private UploadService uploadService;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private EstatisticasService estatisticasService;

    @Autowired
    private CommandInvoker commandInvoker;

    public ReceitaController(
            ReceitaService receitaService,
            UsuarioService usuarioService) {
        this.receitaService = receitaService;
        this.usuarioService = usuarioService;
    }

    private Map<String, Object> receitaParaMap(Receita r, boolean incluirFavoritos) {
        Map<String, Object> mapa = new LinkedHashMap<>();
        mapa.put("id", r.getId());
        mapa.put("titulo", r.getTitulo());
        mapa.put("ingredientes", r.getIngredientes());
        mapa.put("imagem", r.getImagem());
        mapa.put("modoPreparo", r.getModoPreparo());
        mapa.put("tempoPreparo", r.getTempoPreparo());
        mapa.put("porcoes", r.getPorcoes());
        mapa.put("chefe", r.getChefe());
        mapa.put("categoria", r.getCategoria());
        mapa.put("status", r.getStatus());
        mapa.put("motivoRejeicao", r.getMotivoRejeicao());

        if (r.getUsuario() != null) {
            mapa.put("usuarioId", r.getUsuario().getId());
        }

        if (incluirFavoritos) {
            mapa.put("totalFavoritos", favoritoService.contarCurtidas(r));
        }

        return mapa;
    }

    private Usuario obterUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null
                || !auth.isAuthenticated()
                || auth.getName().equals("anonymousUser")) {
            return null;
        }

        return usuarioService.findByEmail(auth.getName()).orElse(null);
    }

    @Operation(
        summary = "Listar receitas aprovadas",
        description = "Retorna todas as receitas com status APROVADA. Endpoint público usado na página inicial."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"receitas\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"categoria\": \"DOCE\", \"status\": \"APROVADA\", \"totalFavoritos\": 12}]}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar receitas\"}")
            )
        )
    })
    @GetMapping
    public ResponseEntity<?> listarAprovadas() {
        try {
            List<Receita> receitas = receitaService.listarAprovadas();
            List<Map<String, Object>> lista = new ArrayList<>();

            for (Receita r : receitas) {
                lista.add(receitaParaMap(r, true));
            }

            return ResponseEntity.ok(Map.of("receitas", lista));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao listar receitas"));
        }
    }

    @Operation(
        summary = "Listar minhas receitas",
        description = "Retorna as receitas do usuário autenticado, agrupadas por status (pendentes, aprovadas e rejeitadas)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"pendentes\": [], \"aprovadas\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"status\": \"APROVADA\"}], \"rejeitadas\": []}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Usuário não autenticado\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/minhas")
    public ResponseEntity<?> minhasReceitas(
            @Parameter(description = "Número da página (começa em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Quantidade de receitas por página", example = "20")
            @RequestParam(defaultValue = "20") int size) {

        Usuario usuario = obterUsuarioLogado();

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<Receita> pendentes = receitaService.listarPorUsuarioEStatus(usuario.getId(), StatusReceita.PENDENTE, pageable);
        Page<Receita> aprovadas = receitaService.listarPorUsuarioEStatus(usuario.getId(), StatusReceita.APROVADA, pageable);
        Page<Receita> rejeitadas = receitaService.listarPorUsuarioEStatus(usuario.getId(), StatusReceita.REJEITADA, pageable);

        List<Map<String, Object>> listaPendentes = new ArrayList<>();
        List<Map<String, Object>> listaAprovadas = new ArrayList<>();
        List<Map<String, Object>> listaRejeitadas = new ArrayList<>();

        for (Receita r : pendentes.getContent()) listaPendentes.add(receitaParaMap(r, true));
        for (Receita r : aprovadas.getContent()) listaAprovadas.add(receitaParaMap(r, true));
        for (Receita r : rejeitadas.getContent()) listaRejeitadas.add(receitaParaMap(r, true));

        return ResponseEntity.ok(Map.of(
                "pendentes", listaPendentes,
                "aprovadas", listaAprovadas,
                "rejeitadas", listaRejeitadas
        ));
    }

    @Operation(
        summary = "Listar receitas pendentes",
        description = "Retorna as receitas com status PENDENTE, com filtro de busca. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"receitas\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"status\": \"PENDENTE\"}], \"currentPage\": 0, \"totalPages\": 1, \"totalItems\": 1, \"totalPendentes\": 1, \"totalRejeitadas\": 0}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar receitas\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/pendentes")
    public ResponseEntity<?> listarPendentes(
            @Parameter(description = "Número da página (começa em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Quantidade de receitas por página", example = "12")
            @RequestParam(defaultValue = "12") int size,

            @Parameter(description = "Termo de busca por título", example = "bolo")
            @RequestParam(required = false) String busca) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Receita> pagina = receitaService.listarPorStatusEBusca(StatusReceita.PENDENTE, busca, pageable);

        List<Map<String, Object>> lista = new ArrayList<>();
        for (Receita r : pagina.getContent()) lista.add(receitaParaMap(r, true));

        return ResponseEntity.ok(Map.of(
                "receitas", lista,
                "currentPage", pagina.getNumber(),
                "totalPages", pagina.getTotalPages(),
                "totalItems", pagina.getTotalElements(),
                "totalPendentes", receitaService.contarPorStatus(StatusReceita.PENDENTE),
                "totalRejeitadas", receitaService.contarPorStatus(StatusReceita.REJEITADA)
        ));
    }

    @Operation(
        summary = "Listar receitas rejeitadas",
        description = "Retorna as receitas com status REJEITADA, com filtro de busca. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"receitas\": [{\"id\": 2, \"titulo\": \"Bolo Queimado\", \"status\": \"REJEITADA\", \"motivoRejeicao\": \"Imagem com baixa qualidade\"}], \"currentPage\": 0, \"totalPages\": 1, \"totalItems\": 1, \"totalPendentes\": 1, \"totalRejeitadas\": 1}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar receitas\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/rejeitadas")
    public ResponseEntity<?> listarRejeitadas(
            @Parameter(description = "Número da página (começa em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Quantidade de receitas por página", example = "12")
            @RequestParam(defaultValue = "12") int size,

            @Parameter(description = "Termo de busca por título", example = "bolo")
            @RequestParam(required = false) String busca) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Receita> pagina = receitaService.listarPorStatusEBusca(StatusReceita.REJEITADA, busca, pageable);

        List<Map<String, Object>> lista = new ArrayList<>();
        for (Receita r : pagina.getContent()) lista.add(receitaParaMap(r, true));

        return ResponseEntity.ok(Map.of(
                "receitas", lista,
                "currentPage", pagina.getNumber(),
                "totalPages", pagina.getTotalPages(),
                "totalItems", pagina.getTotalElements(),
                "totalPendentes", receitaService.contarPorStatus(StatusReceita.PENDENTE),
                "totalRejeitadas", receitaService.contarPorStatus(StatusReceita.REJEITADA)
        ));
    }

    @Operation(
        summary = "Listar receitas aprovadas (admin)",
        description = "Retorna as receitas com status APROVADA, ordenadas por título. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"receitas\": [{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"status\": \"APROVADA\"}], \"currentPage\": 0, \"totalPages\": 1, \"totalItems\": 1}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao listar receitas\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/aprovadas")
    public ResponseEntity<?> listarAprovadasAdmin(
            @Parameter(description = "Número da página (começa em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Quantidade de receitas por página", example = "12")
            @RequestParam(defaultValue = "12") int size,

            @Parameter(description = "Termo de busca por título", example = "bolo")
            @RequestParam(required = false) String busca) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "titulo"));
        Page<Receita> pagina = receitaService.listarPorStatusEBusca(StatusReceita.APROVADA, busca, pageable);

        List<Map<String, Object>> lista = new ArrayList<>();
        for (Receita r : pagina.getContent()) lista.add(receitaParaMap(r, true));

        return ResponseEntity.ok(Map.of(
                "receitas", lista,
                "currentPage", pagina.getNumber(),
                "totalPages", pagina.getTotalPages(),
                "totalItems", pagina.getTotalElements()
        ));
    }

    @Operation(
        summary = "Buscar receita por ID",
        description = "Retorna os dados completos de uma receita específica. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"ingredientes\": \"200g de farinha||3 ovos\", \"modoPreparo\": \"Misture tudo||Asse por 35 minutos\", \"categoria\": \"DOCE\", \"status\": \"APROVADA\", \"totalFavoritos\": 12}")
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Receita não encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita não encontrada\"}")
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @Parameter(description = "ID da receita", required = true, example = "1")
            @PathVariable Long id) {
        Receita r = receitaService.buscarPorId(id).orElse(null);

        if (r == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Receita não encontrada"));
        }

        return ResponseEntity.ok(receitaParaMap(r, true));
    }

    @Operation(
        summary = "Criar nova receita",
        description = "Cria uma nova receita com status PENDENTE. Aceita upload de imagem e lista de ingredientes/passos. Requer autenticação."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Receita criada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita enviada para aprovação\", \"receita\": {\"id\": 1, \"titulo\": \"Bolo de Chocolate\", \"status\": \"PENDENTE\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Usuário não autenticado\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> criarReceita(
            @Parameter(description = "Título da receita", required = true, example = "Bolo de Chocolate")
            @RequestParam String titulo,

            @Parameter(description = "Nome do chef (opcional — usa o nome do usuário se vazio)", example = "Chef Confeiteiro")
            @RequestParam(required = false) String chefe,

            @Parameter(description = "Tempo de preparo formatado", required = true, example = "1h 10min")
            @RequestParam String tempoPreparo,

            @Parameter(description = "Número de porções", required = true, example = "5")
            @RequestParam Integer porcoes,

            @Parameter(description = "Categoria da receita", required = true, example = "DOCE")
            @RequestParam String categoria,

            @Parameter(description = "Lista de ingredientes (1 por linha)", example = "200g de farinha")
            @RequestParam(required = false) List<String> ingredientes,

            @Parameter(description = "Lista de passos do modo de preparo (1 por linha)", example = "Misture os secos")
            @RequestParam(required = false) List<String> modoPreparo,

            @Parameter(description = "Arquivo de imagem da receita (opcional)")
            @RequestParam(value = "imagemFile", required = false)
            MultipartFile imagemFile) throws Exception {

        Usuario usuario = obterUsuarioLogado();

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        Receita receita = ReceitaFactory.criarPendente(null, usuario);

        receita.setUsuario(usuario);
        receita.setChefe(chefe != null && !chefe.isBlank() ? chefe : usuario.getNome());

        String ingredientesStr = ingredientes != null
                ? ingredientes.stream().map(String::trim).filter(s -> !s.isEmpty()).reduce((a, b) -> a + "||" + b).orElse("")
                : "";

        String modoPreparoStr = modoPreparo != null
                ? modoPreparo.stream().map(String::trim).filter(s -> !s.isEmpty()).reduce((a, b) -> a + "||" + b).orElse("")
                : "";

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        receita.atualizarDados(titulo, receita.getChefe(), tempoPreparo, porcoes, Receita.Categoria.valueOf(categoria), ingredientesStr, modoPreparoStr, nomeArquivo);
        receita.setStatus(StatusReceita.PENDENTE);

        receitaService.salvar(receita);

        Command cmdEstatisticas = new com.receitas.site_receitas.command.AtualizarEstatisticasCommand(
                receitaService, favoritoService, estatisticasService, notificacaoService, usuario
        );
        commandInvoker.executar(cmdEstatisticas);

        List<Usuario> admins = usuarioService.listarPorRole("ADMIN");

        for (Usuario admin : admins) {
            if (admin.getId().equals(usuario.getId())) continue;
            notificacaoService.salvar(NotificacaoFactory.novaReceitaParaAdmin(admin, receita.getTitulo()));
        }

        notificacaoService.salvar(NotificacaoFactory.receitaEnviadaParaAutor(usuario, receita.getTitulo()));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Receita enviada para aprovação", "receita", receitaParaMap(receita, true)));
    }

    @Operation(
        summary = "Editar receita",
        description = "Atualiza os dados de uma receita existente. Aceita upload de nova imagem. Requer autenticação."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita atualizada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita atualizada com sucesso\", \"receita\": {\"id\": 1, \"titulo\": \"Bolo de Chocolate\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Receita não encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita não encontrada\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editarReceita(
            @Parameter(description = "ID da receita a ser editada", required = true, example = "1")
            @PathVariable Long id,

            @Parameter(description = "Título da receita", required = true, example = "Bolo de Chocolate")
            @RequestParam String titulo,

            @Parameter(description = "Nome do chef", example = "Chef Confeiteiro")
            @RequestParam(required = false) String chefe,

            @Parameter(description = "Tempo de preparo formatado", required = true, example = "1h 10min")
            @RequestParam String tempoPreparo,

            @Parameter(description = "Número de porções", required = true, example = "5")
            @RequestParam Integer porcoes,

            @Parameter(description = "Categoria da receita", required = true, example = "DOCE")
            @RequestParam String categoria,

            @Parameter(description = "Lista de ingredientes (1 por linha)", example = "200g de farinha")
            @RequestParam(required = false) List<String> ingredientes,

            @Parameter(description = "Lista de passos do modo de preparo (1 por linha)", example = "Misture os secos")
            @RequestParam(required = false) List<String> modoPreparo,

            @Parameter(description = "Nova imagem da receita (opcional)")
            @RequestParam(value = "imagemFile", required = false)
            MultipartFile imagemFile) throws Exception {

        Receita existente = receitaService.buscarPorId(id).orElse(null);

        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Receita não encontrada"));
        }

        String ingredientesStr = ingredientes != null
                ? ingredientes.stream().map(String::trim).filter(s -> !s.isEmpty()).reduce((a, b) -> a + "||" + b).orElse("")
                : null;

        String modoPreparoStr = modoPreparo != null
                ? modoPreparo.stream().map(String::trim).filter(s -> !s.isEmpty()).reduce((a, b) -> a + "||" + b).orElse("")
                : null;

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        existente.atualizarDados(titulo, chefe, tempoPreparo, porcoes, Receita.Categoria.valueOf(categoria), ingredientesStr, modoPreparoStr, nomeArquivo);
        receitaService.salvar(existente);

        return ResponseEntity.ok(Map.of("message", "Receita atualizada com sucesso", "receita", receitaParaMap(existente, true)));
    }

    @Operation(
        summary = "Aprovar receita",
        description = "Aprova uma receita pendente e notifica o autor e demais usuários. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita aprovada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita aprovada com sucesso\"}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao aprovar receita\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovarReceita(
            @Parameter(description = "ID da receita a ser aprovada", required = true, example = "1")
            @PathVariable Long id) {
        Command command = new AprovarReceitaCommand(
                receitaService, usuarioService, notificacaoService, favoritoService, estatisticasService, id
        );
        commandInvoker.executar(command);
        return ResponseEntity.ok(Map.of("message", "Receita aprovada com sucesso"));
    }

    @Operation(
        summary = "Rejeitar receita",
        description = "Rejeita uma receita pendente com um motivo e notifica o autor. Requer perfil ADMIN."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita rejeitada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita rejeitada com sucesso\"}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Erro ao rejeitar receita\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitarReceita(
            @Parameter(description = "ID da receita a ser rejeitada", required = true, example = "1")
            @PathVariable Long id,

            @Parameter(description = "Motivo da rejeição", example = "Imagem com baixa qualidade")
            @RequestParam(required = false) String motivo) {
        Command command = new RejeitarReceitaCommand(
                receitaService, notificacaoService, favoritoService, estatisticasService, id, motivo
        );
        commandInvoker.executar(command);
        return ResponseEntity.ok(Map.of("message", "Receita rejeitada com sucesso"));
    }

    @Operation(
        summary = "Excluir receita",
        description = "Remove uma receita do sistema, sua imagem e notifica o autor. Requer autenticação (admin ou autor)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita excluída com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita excluída com sucesso\"}")
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Receita não encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Receita não encontrada\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirReceita(
            @Parameter(description = "ID da receita a ser excluída", required = true, example = "1")
            @PathVariable Long id) {
        if (!receitaService.existe(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Receita não encontrada"));
        }

        Command command = new ExcluirReceitaCommand(
                receitaService, notificacaoService, favoritoService, estatisticasService, uploadService, id
        );
        commandInvoker.executar(command);

        return ResponseEntity.ok(Map.of("message", "Receita excluída com sucesso"));
    }
}
