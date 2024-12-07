import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/demo/service/login.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CategoriasService } from 'src/app/demo/service/categoria.service';
import { ProductosService } from 'src/app/demo/service/producto.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    loginForm!: FormGroup;
    errorMessage = '';
    loading = false;

    constructor(
        private fb: FormBuilder,
        public layoutService: LayoutService,
        private loginService: LoginService,
        private router: Router,
        private categoriasService: CategoriasService,
        private productosService: ProductosService
    ) {
        this.loginForm = this.fb.group({
            userid: ['', [Validators.required]],
            pass: ['', [Validators.required]],
            rememberMe: [false],
        });
    }

    async login() {
        if (this.loginForm.invalid) {
            this.errorMessage =
                'Por favor, completa todos los campos requeridos.';
            return;
        }
        this.errorMessage = '';
        this.loading = true;
        const login = this.loginForm.value;
        login.pass = CryptoJS.MD5(login.pass).toString();
        try {
            const loginRequest = this.loginForm.value;
            const user = await firstValueFrom(
                this.loginService.iniciarSesion(loginRequest)
            );

            const categorias = await firstValueFrom(
                this.categoriasService.obtenerCategorias()
            );

            // Cargar productos
            const productos = await firstValueFrom(
                this.productosService.obtenerProductos({total:1})
            );
            console.log('Productos cargados:', productos);
            console.log('Categorías obtenidas:', categorias);
            this.router.navigate(['/']);
        } catch (err) {
            console.error('Error en login:', err);
            this.errorMessage =
                typeof err === 'string' ? err : 'Ocurrió un error inesperado.';
        } finally {
            this.loading = false;
        }
    }
}
