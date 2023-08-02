import { Injectable } from '@angular/core';
import { Team, TeamService } from './team.service';
import { Activity, ActivityService } from './activity.service';
import { skip } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Enrollment{
  id_team:number;
  id_activity:number;

  constructor (id_team:number, id_activity:number){
    this.id_team = id_team;
    this.id_activity = id_activity;

  }
}


@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  private apiUrl = 'http://localhost:8080/enrollments/all';
  enrollments: Enrollment[] = [];

  constructor(
    private http: HttpClient,
    private teamService: TeamService,
    private activityService: ActivityService
  ) {
    this.loadEnrollments().subscribe(
      (enrollments: Enrollment[]) => {
        this.enrollments = enrollments.map((enrollment: any) => {
          const idTeam: number = enrollment.id_team?.id_team;
          const idActivity: number = enrollment.id_activity?.id;
          return new Enrollment(idTeam, idActivity);
        });
        console.log('All Enrollments:', this.enrollments);
      },
      (error) => {
        console.error('Error loading enrollments:', error);
      }
    );
  }

  addEnrollment(id_team: number, id_activity: number): void {
    this.enrollments.push({ id_team, id_activity });
  }

  getAllEnrollments(): Enrollment[] {
    console.log("aici suntem in enrol service",this.enrollments)
    return this.enrollments;
  }

  getEnrollmentsByTeamId(id_team: number): Enrollment[] {
    return this.enrollments.filter(enrollment => enrollment.id_team === id_team);
  }

  getEnrollmentsByActivityId(activityId: number): any {
    return this.enrollments.filter(enrollment => enrollment.id_activity === activityId);
  }

  getTeamsEnrolledInActivity(id_activity: number): Team[] {
    const enrollmentsForActivity = this.enrollments.filter(enrollment => enrollment.id_activity === id_activity);
    const teams: Team[] = this.teamService.getTeams();
    const teamsEnrolled: Team[] = [];
  
    for (const enrollment of enrollmentsForActivity) {
      const team = teams.find(t => t.id_team === enrollment.id_team);
      if (team) {
        teamsEnrolled.push(team);
      }
    }
  
    return teamsEnrolled;
  }

  getTeamEnrollments(id_team: number): Activity[]{
    const teamActivity:Activity[] = [];
    const teamEnrollments:Enrollment[] = this.enrollments.filter(enrollment => enrollment.id_team === id_team);
    const allActivity:Activity[] = this.activityService.getActivities();

    for (var enrollment of teamEnrollments){
      for (var activity of allActivity){
        if (activity.id == enrollment.id_activity) teamActivity.push(activity);
      }
    }

    return teamActivity;
  }
  private loadEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }
}
