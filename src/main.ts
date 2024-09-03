import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';


function loggingInterceptor(request:HttpRequest<unknown>, next:HttpHandlerFn){
    // const req = request.clone({
    //     headers:request.headers.set('XDebg','TESTING')
    // });//wich part of requst will change
    // console.log(['outgoing request']);
    // console.log(request);
    // return next(request).pipe(
    //     tap({
    //         next:(event)=>{
    //             if(event.type === HttpEventType.Response){
    //                 //status
    //                 //body
    //             }

    //     }
    // })
    // );
    // withInterceptors([loggingInterceptor])
}

bootstrapApplication(AppComponent,{
    providers:[provideHttpClient()]
}).catch((err) => console.error(err));
