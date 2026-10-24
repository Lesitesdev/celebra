package br.com.celebra.api;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalidRequest(MethodArgumentNotValidException exception) {
        String field = exception.getBindingResult().getFieldErrors().stream()
            .findFirst().map(error -> error.getField()).orElse("");
        String message = switch (field) {
            case "password" -> "A senha precisa ter pelo menos 12 caracteres.";
            case "email" -> "Informe um endereço de e-mail válido.";
            case "fullName" -> "Informe seu nome para criar a conta.";
            case "accountType" -> "Escolha como você vai usar o Celebra.";
            case "accountName" -> "Informe o nome do buffet.";
            default -> "Confira os campos preenchidos e tente novamente.";
        };
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
