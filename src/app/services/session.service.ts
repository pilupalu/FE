import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserService } from './user.service';
import { Activity, ActivityService } from './activity.service';
import { Enrollment, EnrollmentsService } from './enrollments.service';

export class Session {
  user: number;
  activity: number;
  date: string;
  attended: boolean;

  constructor(user: number, id_activity: number, date: string, attended: boolean) {
    this.user = user;
    this.activity = id_activity;
    this.date = date;
    this.attended = attended;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessions: Session[] = [];
  private apiUrl = "http://localhost:8080/sessions/all"
  private createSessionsUrl = "http://localhost:8080/sessions/create-sessions";

  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private enrollmentsService: EnrollmentsService,
    private http: HttpClient
  ) {
    // Call the loadSessions method during service initialization
    this.loadSessions().subscribe(
      (sessionsData: any[]) => {
        this.sessions = sessionsData.map((sessionData: any) => {
          // Extract the id property from the nested object for user and activity
          const userId: number = sessionData.user?.id;
          const activityId: number = sessionData.activity?.id;
          const date: string = sessionData.date;
          const attended: boolean = sessionData.attended;
          return new Session(userId, activityId, date, attended);
        });
        console.log(this.sessions)
      },
      (error) => {
        console.error('Error loading sessions:', error);
      }
    );
  }

  createSessionsForActivity(activityId: number) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).substr(-2);
    const todayDate = `${dd}/${mm}/${yy}`;
  
    const usersInActivity = this.getUsersByActivityId(activityId);
    console.log(this.enrollmentsService.getEnrollmentsByActivityId(activityId), this.activityService.getActivities());
    console.log("prostu satului", activityId)
  
    for (const user of usersInActivity) {
      const session = new Session(user.id, activityId, todayDate, false);
      this.sessions.push(session);
    }
  
    // Call the backend endpoint to create the sessions for the activity and date
    const params = new HttpParams()
      .set('activityId', String(activityId))
      .set('date', todayDate);
  
    this.http.post(this.createSessionsUrl, null, { params }).subscribe(
      (response: any) => {
        console.log('Sessions created:', response);
      },
      (error) => {
        console.error('Error creating sessions:', error);
      }
    );
  }

  getSessionsForCurrentActivity(activityId: number) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).substr(-2);
    const todayDate = `${dd}/${mm}/${yy}`;
    console.log(todayDate);

    return this.sessions.filter(session => session.activity === activityId && session.date === todayDate);
  }

  private getUsersByActivityId(activityId: number): User[] {
    const enrolledTeams = this.enrollmentsService.getEnrollmentsByActivityId(activityId);
    const enrolledTeamIds = enrolledTeams.map((enrollment: { id_team: any; }) => enrollment.id_team);

    return this.userService.getAllUsers().filter(user => enrolledTeamIds.includes(user.id_team!));
  }

  getActivitiesWithSessionsForToday(): Activity[] {
    const todayDate = this.getFormattedDate(new Date());
    const activities = this.activityService.getActivities();
    const activitiesWithSessionsForToday = activities.filter((activity) => {
      return this.sessions.some((session) => session.activity === activity.id && session.date === todayDate);
    });

    return activitiesWithSessionsForToday;
  }

  private getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  private loadSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }
}
