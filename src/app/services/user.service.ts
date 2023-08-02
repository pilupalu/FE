import { Injectable } from '@angular/core';
import { Team } from './team.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export class User{
  id: number;
  name: string;
  email: string;
  role: string;
  id_team: number | null;

  constructor(id:number, name:string, email:string, role:string, id_team?:number){
    this.id =  id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.id_team = id_team ? id_team : null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;
  
  private apiUrl = 'http://localhost:8080/users/all';
  private users: User[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    console.log(this.currentUser);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserByEmail(email: string): User | null {
    const user = this.users.find((user) => user.email === email);
    return user ? user : null;
  }

  getUserById(id: number): User | null {
    const user = this.users.find((user) => user.id === id);
    return user ? user : null;
  }
  
  getUsersByTeamId(teamId: number): User[] {
    return this.users.filter(user => user.id_team === teamId);
  }


  private loadUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((usersData: any[]) => {
        return usersData.map((userData: any) => {
          const idTeam: number = userData.id_team?.id_team;
          return new User(userData.id, userData.name, userData.email, this.mapUserRole(userData.role), idTeam);
        });
      })
    );
  }

  mapUserRole(role: string): string {
    const lowercaseRole = role.toLowerCase();
    return lowercaseRole.charAt(0).toUpperCase() + lowercaseRole.slice(1);
  }
}
