import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Activity {
  id: number;
  name: string;

  constructor(id: number, name:string){
    this.id = id;
    this.name = name;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8080/activities/all';
  private activities: Activity[] = [];

  constructor(private http: HttpClient) {
    this.loadActivities().subscribe(
      (activities: Activity[]) => {
        this.activities = activities;
      },
      (error) => {
        console.error('Error loading activities:', error);
      }
    );
  }

  getActivityById (id:number):Activity{
      const activity = this.activities.find (t => t.id === id);
    return activity!;
  }
  getActivities(): Activity[] {
    return this.activities;
  }

  private loadActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }
}
