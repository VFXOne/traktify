import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { FrameComponent } from './app/components/frame/frame.component';

bootstrapApplication(FrameComponent, appConfig)
  .catch((err) => console.error(err));
