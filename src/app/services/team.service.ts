import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Team {
  id_leader: number;
  id_team: number;
  team_name: string;

  constructor(id_leader: number, id_team: number, team_name: string) {
    this.id_leader = id_leader;
    this.id_team = id_team;
    this.team_name = team_name;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8080/teams/all';
  private teams: Team[] = [];

  constructor(private http: HttpClient) {
    this.loadTeams().subscribe(
      (teams: Team[]) => {
        this.teams = teams.map((team: any) => {
          const idLeader: number = team.id_leader?.id;
          return new Team(idLeader, team.id_team, team.team_name);
        });
        console.log(this.teams);
      },
      (error) => {
        console.error('Error loading teams:', error);
      }
    );
  }

  getTeams(): Team[] {
    return this.teams;
  }

  addTeam(team: Team) {
    this.teams.push(team);
  }
  
  getTeamById(teamId: number): Team | undefined {
    return this.teams.find(team => team.id_team === teamId);
  }

  isCurrentUserLeaderOfTeam(teamId: number | null | undefined, currentUserId: number | null | undefined): boolean {
    const team = this.teams.find(t => t.id_team === teamId);
    return team ? team.id_leader === currentUserId : false;
  }

  private loadTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }
}