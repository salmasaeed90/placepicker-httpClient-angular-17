import { Component, DestroyRef, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
  
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  baseUrl = `http://localhost:3000`;

  constructor(private _HttpClient:HttpClient,
    private destroyRef:DestroyRef,
    private _PlacesService:PlacesService
  ){}
  ngOnInit(){
    this.isFetching.set(true)
    const subscription = this._PlacesService.loadAvailablePlaces().subscribe({
      next:(places)=>{
        //this.isFetching.set(false)
        console.log(places);
        
        this.places.set(places);
      },
      error:(error:Error)=>{
        
        this.error.set(error.message);
      },
      complete:()=>{
        this.isFetching.set(false)
      }
    })

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }


  onSelectPlace(selectedPlace : Place){
   const subscription = this._PlacesService.addPlaceToUserPlaces(selectedPlace).subscribe(
      {
        next:(resData)=>{
          console.log(resData);
          
        }
      }
    )
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
 
}
