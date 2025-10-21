import { bootstrapApplication } from '@angular/platform-browser';
import { FrameComponent } from './app/components/containers/frame/frame.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(FrameComponent, config);

export default bootstrap;
