package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.command.AprovarReceitaCommand;
import com.receitas.site_receitas.command.Command;
import com.receitas.site_receitas.command.CommandInvoker;
import com.receitas.site_receitas.command.ExcluirReceitaCommand;
import com.receitas.site_receitas.command.RejeitarReceitaCommand;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.factory.ReceitaFactory;
import com.receitas.site_receitas.service.CarrosselService;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.SiteConfigService;
import com.receitas.site_receitas.service.UploadService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@Tag(name = "Receitas", description = "Endpoints de receitas")
public class ReceitaController {

    private final ReceitaService receitaService;
    private final UsuarioService usuarioService;

    @Autowired
    private CarrosselService carrosselService;

    @Autowired
    private SiteConfigService siteConfigService;

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

    @GetMapping("/")
    public String index(Model model, Authentication authentication) {

        if (authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (isAdmin) {
                return "redirect:/usuarios";
            }
        }

        model.addAttribute("paginaAtual", "inicio");

        model.addAttribute("receitas", receitaService.listarAprovadas());

        List<CarrosselItem> carrosselItens = carrosselService.listarAtivos();

        model.addAttribute("carrosselItens", carrosselItens);

        model.addAttribute("faviconUrl", siteConfigService.getConfigValue("favicon_url"));
        model.addAttribute("ganacheUrl", siteConfigService.getConfigValue("ganache_url"));
        model.addAttribute("sopaUrl", siteConfigService.getConfigValue("sopa_url"));
        model.addAttribute("pestoUrl", siteConfigService.getConfigValue("pesto_url"));
        model.addAttribute("bolinhoUrl", siteConfigService.getConfigValue("bolinho_url"));

        if (authentication != null
                && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {

            String email = authentication.getName();

            Optional<Usuario> usuario = usuarioService.findByEmail(email);

            if (usuario.isPresent()) {
                model.addAttribute("nomeUsuario", usuario.get().getNome());
            } else {
                model.addAttribute("nomeUsuario", email);
            }
        }

        return "principal/index";
    }

    @GetMapping("/nova")
    public String novaReceitaForm(Model model) {

        model.addAttribute("paginaAtual", "nova");

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email = authentication.getName();

        Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);

        Receita receita = ReceitaFactory.criarPendente(null, usuarioOpt.orElse(null));

        if (usuarioOpt.isPresent()) {
            receita.setChefe(usuarioOpt.get().getNome());
        } else {
            receita.setChefe(email);
        }

        model.addAttribute("receita", receita);

        if (usuarioOpt.isPresent()) {
            model.addAttribute("nomeUsuario", usuarioOpt.get().getNome());
        } else {
            model.addAttribute("nomeUsuario", email);
        }

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "principal/receita/form-receita";
    }

    @PostMapping("/salvar")
    public String salvarReceita(
            @ModelAttribute Receita receita,
            @RequestParam("imagemFile") MultipartFile imagemFile,
            @RequestParam(required = false, name = "ingredientes[]") List<String> ingredientes,
            @RequestParam(required = false, name = "modoPreparo[]") List<String> modoPreparo,
            RedirectAttributes redirectAttributes) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email = authentication.getName();

        Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            receita.setUsuario(usuarioOpt.get());
            if (receita.getChefe() == null || receita.getChefe().isBlank()) {
                receita.setChefe(usuarioOpt.get().getNome());
            }
        } else {
            if (receita.getChefe() == null || receita.getChefe().isBlank()) {
                receita.setChefe(email);
            }
        }

        String ingredientesStr = ingredientes != null
                ? ingredientes.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : "";

        String modoPreparoStr = modoPreparo != null
                ? modoPreparo.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : "";

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        receita.atualizarDados(
                receita.getTitulo(),
                receita.getChefe(),
                receita.getTempoPreparo(),
                receita.getPorcoes(),
                receita.getCategoria(),
                ingredientesStr,
                modoPreparoStr,
                nomeArquivo
        );

        receita.setStatus(StatusReceita.PENDENTE);

        receitaService.salvar(receita);

        if (receita.getUsuario() != null) {
            Command cmdEstatisticas = new com.receitas.site_receitas.command.AtualizarEstatisticasCommand(
                    receitaService,
                    favoritoService,
                    estatisticasService,
                    notificacaoService,
                    receita.getUsuario()
            );
            commandInvoker.executar(cmdEstatisticas);
        }

        List<Usuario> administradores = usuarioService.listarPorRole("ADMIN");

        for (Usuario admin : administradores) {
            if (receita.getUsuario() != null
                    && admin.getId().equals(receita.getUsuario().getId())) {
                continue;
            }

            Notificacao notificacaoAdmin = NotificacaoFactory.novaReceitaParaAdmin(admin, receita.getTitulo());
            notificacaoService.salvar(notificacaoAdmin);
        }

        if (receita.getUsuario() != null) {
            Notificacao notificacaoAutor = NotificacaoFactory.receitaEnviadaParaAutor(
                    receita.getUsuario(),
                    receita.getTitulo()
            );
            notificacaoService.salvar(notificacaoAutor);
        }

        redirectAttributes.addFlashAttribute(
                "successMessage",
                "Receita enviada para aprovação com sucesso!"
        );

        return "redirect:/minhas-receitas?enviada=1";
    }

    @GetMapping("/pendentes")
    public String pendentes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "pendentes") String aba,
            Model model) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        StatusReceita status = "rejeitadas".equals(aba)
                ? StatusReceita.REJEITADA
                : StatusReceita.PENDENTE;

        Page<Receita> pagina = receitaService.listarPorStatusEBusca(status, busca, pageable);

        long totalPendentes = receitaService.contarPorStatus(StatusReceita.PENDENTE);
        long totalRejeitadas = receitaService.contarPorStatus(StatusReceita.REJEITADA);

        model.addAttribute("paginaAtual", "pendentes");
        model.addAttribute("abaAtiva", aba);
        model.addAttribute("receitas", pagina.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", pagina.getTotalPages());
        model.addAttribute("totalItems", pagina.getTotalElements());
        model.addAttribute("totalPendentes", totalPendentes);
        model.addAttribute("totalRejeitadas", totalRejeitadas);
        model.addAttribute("pageSize", size);
        model.addAttribute("busca", busca);

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "admin/receitas-pendentes";
    }

    @GetMapping("/receitas-aprovadas")
    public String receitasAprovadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String busca,
            Model model) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.ASC, "titulo")
        );

        Page<Receita> pagina = receitaService.listarPorStatusEBusca(
                StatusReceita.APROVADA,
                busca,
                pageable
        );

        model.addAttribute("paginaAtual", "receitas-aprovadas");
        model.addAttribute("receitas", pagina.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", pagina.getTotalPages());
        model.addAttribute("totalItems", pagina.getTotalElements());
        model.addAttribute("pageSize", size);
        model.addAttribute("busca", busca);

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "admin/receitas-aprovadas";
    }

    @GetMapping("/receitas-aprovadas/{id}/detalhes")
    public String detalhesFragmento(
            @PathVariable Long id,
            Model model) {

        Receita receita = receitaService.buscarPorId(id).orElse(null);

        if (receita == null) {
            return "redirect:/receitas-aprovadas";
        }

        List<String> ingredientesList = receita.getIngredientes() != null
                ? Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        List<String> modoPreparoList = receita.getModoPreparo() != null
                ? Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        model.addAttribute("receita", receita);
        model.addAttribute("ingredientesList", ingredientesList);
        model.addAttribute("modoPreparoList", modoPreparoList);

        return "admin/modais/visualizar-receita-admin :: conteudo";
    }

    @GetMapping("/pendentes/{id}/detalhes")
    public String detalhesFragmentoPendente(
            @PathVariable Long id,
            Model model) {

        Receita receita = receitaService.buscarPorId(id).orElse(null);

        if (receita == null) {
            return "redirect:/pendentes";
        }

        List<String> ingredientesList = receita.getIngredientes() != null
                ? Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        List<String> modoPreparoList = receita.getModoPreparo() != null
                ? Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        model.addAttribute("receita", receita);
        model.addAttribute("ingredientesList", ingredientesList);
        model.addAttribute("modoPreparoList", modoPreparoList);

        return "admin/modais/visualizar-receita-admin :: conteudo";
    }

    @PostMapping("/pendentes/editar/{id}")
    public String editarReceitaPendente(
            @PathVariable Long id,
            @ModelAttribute Receita receita,
            @RequestParam(value = "imagemFile", required = false) MultipartFile imagemFile,
            @RequestParam(value = "ingredientes[]", required = false) List<String> ingredientes,
            @RequestParam(value = "modoPreparo[]", required = false) List<String> modoPreparo) throws Exception {

        Receita existente = receitaService.buscarPorId(id).orElse(null);

        if (existente == null) {
            return "redirect:/pendentes";
        }

        String ingredientesStr = ingredientes != null
                ? ingredientes.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : null;

        String modoPreparoStr = modoPreparo != null
                ? modoPreparo.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : null;

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        existente.atualizarDados(
                receita.getTitulo(),
                receita.getChefe(),
                receita.getTempoPreparo(),
                receita.getPorcoes(),
                receita.getCategoria(),
                ingredientesStr,
                modoPreparoStr,
                nomeArquivo
        );

        receitaService.salvar(existente);

        return "redirect:/pendentes?ok=editada";
    }

    @PostMapping("/receitas-aprovadas/editar/{id}")
    public String editarReceitaAprovada(
            @PathVariable Long id,
            @ModelAttribute Receita receita,
            @RequestParam(value = "imagemFile", required = false) MultipartFile imagemFile,
            @RequestParam(value = "ingredientes[]", required = false) List<String> ingredientes,
            @RequestParam(value = "modoPreparo[]", required = false) List<String> modoPreparo,
            RedirectAttributes redirectAttributes) throws Exception {

        Receita existente = receitaService.buscarPorId(id).orElse(null);

        if (existente == null) {
            return "redirect:/receitas-aprovadas";
        }

        String ingredientesStr = ingredientes != null
                ? ingredientes.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : null;

        String modoPreparoStr = modoPreparo != null
                ? modoPreparo.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + "||" + b)
                        .orElse("")
                : null;

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        existente.atualizarDados(
                receita.getTitulo(),
                receita.getChefe(),
                receita.getTempoPreparo(),
                receita.getPorcoes(),
                receita.getCategoria(),
                ingredientesStr,
                modoPreparoStr,
                nomeArquivo
        );

        receitaService.salvar(existente);

        redirectAttributes.addFlashAttribute("ok", "editada");

        return "redirect:/receitas-aprovadas";
    }

    @PostMapping("/receitas-aprovadas/excluir/{id}")
    public String excluirReceitaAprovada(@PathVariable Long id) {
        Command command = new ExcluirReceitaCommand(
                receitaService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                uploadService,
                id
        );
        commandInvoker.executar(command);
        return "redirect:/receitas-aprovadas?ok=excluida";
    }

    @PostMapping("/aprovar/{id}")
    public String aprovarReceita(@PathVariable Long id) {
        Command command = new AprovarReceitaCommand(
                receitaService,
                usuarioService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                id
        );
        commandInvoker.executar(command);
        return "redirect:/pendentes?ok=aprovada";
    }

    @PostMapping("/rejeitar/{id}")
    public String rejeitarReceita(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        Command command = new RejeitarReceitaCommand(
                receitaService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                id,
                motivo
        );
        commandInvoker.executar(command);
        return "redirect:/pendentes?ok=rejeitada";
    }

    @GetMapping("/detalhe/{id}")
    public String detalheReceita(
            @PathVariable Long id,
            Model model) {

        model.addAttribute("paginaAtual", "detalhe");

        Receita receita = receitaService.buscarPorId(id).orElse(null);

        if (receita == null) {
            return "redirect:/";
        }

        List<String> ingredientesList = receita.getIngredientes() != null
                ? Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        List<String> modoPreparoList = receita.getModoPreparo() != null
                ? Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        model.addAttribute("receita", receita);
        model.addAttribute("ingredientesList", ingredientesList);
        model.addAttribute("modoPreparoList", modoPreparoList);

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "principal/receita/detalhes-receita";
    }

    @Operation(
        summary = "Excluir receita (REST)",
        description = "Exclui uma receita do sistema via API REST. Executa o ExcluirReceitaCommand que remove a imagem, notifica o autor, deleta do banco e atualiza as estatísticas."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Receita excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Receita não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/receitas/excluir/{id}")
    @ResponseBody
    public ResponseEntity<?> excluirReceita(@PathVariable Long id) {
        try {
            if (!receitaService.existe(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Receita não encontrada"));
            }

            Command command = new ExcluirReceitaCommand(
                    receitaService,
                    notificacaoService,
                    favoritoService,
                    estatisticasService,
                    uploadService,
                    id
            );
            commandInvoker.executar(command);

            return ResponseEntity.ok().body(
                    Map.of("message", "Receita excluída com sucesso", "id", id)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno do servidor"));
        }
    }

    @GetMapping("/minhas-receitas")
    public String minhasReceitas(
            @RequestParam(defaultValue = "pendentes") String aba,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email = authentication.getName();

        Usuario usuario = usuarioService.findByEmail(email).orElse(null);

        if (usuario == null) {
            return "redirect:/";
        }

        Pageable pageable = PageRequest.of(
                page,
                5,
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<Receita> pendentesPage = receitaService.listarPorUsuarioEStatus(
                usuario.getId(), StatusReceita.PENDENTE, pageable);

        Page<Receita> aprovadasPage = receitaService.listarPorUsuarioEStatus(
                usuario.getId(), StatusReceita.APROVADA, pageable);

        Page<Receita> rejeitadasPage = receitaService.listarPorUsuarioEStatus(
                usuario.getId(), StatusReceita.REJEITADA, pageable);

        long curtidasTotal = favoritoService.contarCurtidasPorUsuario(usuario.getId());
        model.addAttribute("curtidasTotal", curtidasTotal);

        Map<Long, Long> curtidasPorReceita = new java.util.HashMap<>();
        
        pendentesPage.getContent().forEach(r -> curtidasPorReceita.put(r.getId(), favoritoService.contarCurtidas(r)));
        aprovadasPage.getContent().forEach(r -> curtidasPorReceita.put(r.getId(), favoritoService.contarCurtidas(r)));
        rejeitadasPage.getContent().forEach(r -> curtidasPorReceita.put(r.getId(), favoritoService.contarCurtidas(r)));

        model.addAttribute("curtidasPorReceita", curtidasPorReceita);

        model.addAttribute("paginaAtual", "minhas-receitas");
        model.addAttribute("nomeUsuario", usuario.getNome());
        model.addAttribute("abaAtiva", aba);

        model.addAttribute("pendentes", pendentesPage.getContent());
        model.addAttribute("pendentesPage", pendentesPage.getNumber());
        model.addAttribute("pendentesTotalPages", pendentesPage.getTotalPages());
        model.addAttribute("pendentesTotal", pendentesPage.getTotalElements());

        model.addAttribute("aprovadas", aprovadasPage.getContent());
        model.addAttribute("aprovadasPage", aprovadasPage.getNumber());
        model.addAttribute("aprovadasTotalPages", aprovadasPage.getTotalPages());
        model.addAttribute("aprovadasTotal", aprovadasPage.getTotalElements());

        model.addAttribute("rejeitadas", rejeitadasPage.getContent());
        model.addAttribute("rejeitadasPage", rejeitadasPage.getNumber());
        model.addAttribute("rejeitadasTotalPages", rejeitadasPage.getTotalPages());
        model.addAttribute("rejeitadasTotal", rejeitadasPage.getTotalElements());

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "principal/minhas-receitas";
    }

    @GetMapping("/minhas-receitas/{id}/detalhes")
    public String detalhesFragmentoCliente(
            @PathVariable Long id,
            Model model) {

        Receita receita = receitaService.buscarPorId(id).orElse(null);

        if (receita == null) {
            return "redirect:/minhas-receitas";
        }

        List<String> ingredientesList = receita.getIngredientes() != null
                ? Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        List<String> modoPreparoList = receita.getModoPreparo() != null
                ? Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        model.addAttribute("receita", receita);
        model.addAttribute("ingredientesList", ingredientesList);
        model.addAttribute("modoPreparoList", modoPreparoList);
        model.addAttribute("totalFavoritos", favoritoService.contarCurtidas(receita));

        return "modais/visualizar-receita :: conteudo";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard(Model model) {

        List<Usuario> usuarios = usuarioService.listarTodos();

        long totalUsuarios = usuarios.size();

        long usuariosAtivos = usuarios.stream()
                .filter(Usuario::isAtivo)
                .count();

        long totalPendentes = receitaService.contarPorStatus(StatusReceita.PENDENTE);
        long totalAprovadas = receitaService.contarPorStatus(StatusReceita.APROVADA);
        long totalRejeitadas = receitaService.contarPorStatus(StatusReceita.REJEITADA);

        List<Receita> aprovadas = receitaService.listarAprovadas();

        long totalFavoritos = aprovadas.stream()
                .mapToLong(favoritoService::contarCurtidas)
                .sum();

        List<Map<String, Object>> topReceitas = new java.util.ArrayList<>();

        aprovadas.stream()
                .map(r -> {
                    Map<String, Object> mapa = new java.util.LinkedHashMap<>();
                    mapa.put("titulo", r.getTitulo());
                    mapa.put("total", favoritoService.contarCurtidas(r));
                    return mapa;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("total"), (Long) a.get("total")))
                .limit(5)
                .forEach(topReceitas::add);

        model.addAttribute("paginaAtual", "dashboard");
        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("usuariosAtivos", usuariosAtivos);
        model.addAttribute("totalPendentes", totalPendentes);
        model.addAttribute("totalAprovadas", totalAprovadas);
        model.addAttribute("totalRejeitadas", totalRejeitadas);
        model.addAttribute("totalFavoritos", totalFavoritos);
        model.addAttribute("topReceitas", topReceitas);
        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "admin/dashboard";
    }

    @GetMapping("/sobre")
    public String sobre(Model model) {

        model.addAttribute("paginaAtual", "sobre");

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {

            String email = authentication.getName();

            Optional<Usuario> usuario = usuarioService.findByEmail(email);

            if (usuario.isPresent()) {
                model.addAttribute("nomeUsuario", usuario.get().getNome());
            } else {
                model.addAttribute("nomeUsuario", email);
            }
        }

        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());

        return "principal/sobre";
    }
}