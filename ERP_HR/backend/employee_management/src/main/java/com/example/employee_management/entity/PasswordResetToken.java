
package com.example.employee_management.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "password_reset_token_seq")
    @SequenceGenerator(name = "password_reset_token_seq", sequenceName = "PASSWORD_RESET_TOKEN_SEQ", allocationSize = 1)
    private long id;

    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private Date expiryDate;

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(60); // 1 hour expiry
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        long now = new Date().getTime();
        return new Date(now + expiryTimeInMinutes * 60 * 1000);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
}
