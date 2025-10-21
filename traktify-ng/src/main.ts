import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { FrameComponent } from './app/components/containers/frame/frame.component';

bootstrapApplication(FrameComponent, appConfig)
  .catch((err) => console.error(err));
