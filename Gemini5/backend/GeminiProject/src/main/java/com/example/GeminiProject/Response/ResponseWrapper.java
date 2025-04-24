package com.example.GeminiProject.Response;

import org.springframework.http.HttpStatus;

import lombok.Data;


@Data
public class ResponseWrapper<T> {
    private boolean success;
    private String message;
    private T data;
    private HttpStatus status;

    public ResponseWrapper(boolean success, String message, T data, HttpStatus status) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.status = status;
    }

    public static <T> ResponseWrapper<T> success(T data, String message, HttpStatus status) {
        return new ResponseWrapper<>(true, message, data, status);
    }

    public static <T> ResponseWrapper<T> error(String message, HttpStatus status) {
        return new ResponseWrapper<>(false, message, null, status);
    }
}
