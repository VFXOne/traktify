import {Component, effect, OnInit, signal, ViewChild} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatStep, MatStepContent, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../facades/login.facade';
import {LoginComponent} from '../containers/login/login.component';
import {MatButton} from '@angular/material/button';
import {GroupSettingsComponent} from '../settings/group-settings/group-settings.component';
import {LoginManagerService} from '../../services/login.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    MatCard,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatStepContent,
    LoginComponent,
    MatButton,
    MatStepperNext,
    GroupSettingsComponent,
    MatStepperPrevious
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  isLoggedIn = this.loginService.isLoggedIn;
  done = signal<boolean>(false);

  constructor(
    private loginService: LoginService,
    private loginManager: LoginManagerService,
    private router: Router
  ) {
    // Si on revient du login Spotify et que l’utilisateur est connecté
    // on avance automatiquement à l’étape suivante
    effect(() => {
      if (this.isLoggedIn()) {
        // Petit délai pour être sûr que le stepper est instancié
        queueMicrotask(() => {
          if (this.stepper) {
            this.stepper.next();
          }
        });
      }
    });
  }

  ngOnInit() {
    void this.loginService.checkLogin();
  }

  finishSetup() {
    this.done.set(true);
    this.loginManager.completeSetup().subscribe(() => {
      void this.router.navigate(['/home']);
    });
  }
}
