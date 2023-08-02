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
    // Call the loadUsers method during service initialization
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
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users: User[]) => {
        return users.map(user => {
          user.role = this.mapUserRole(user.role);
          return user;
        });
      })
    );
  }

  mapUserRole(role: string): string {
    const lowercaseRole = role.toLowerCase();
    return lowercaseRole.charAt(0).toUpperCase() + lowercaseRole.slice(1);
  }
  // private users: User[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     role: 'Mentor',
  //     id_team: null,
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     email: 'jane@example.com',
  //     role: 'Student',
  //     id_team: 1,
  //   },
  //   {
  //     id: 3,
  //     name: 'Jane Smith',
  //     email: 'janed@example.com',
  //     role: 'Student',
  //     id_team: 1,
  //   },
  //   {
  //     id: 10,
  //     name: 'Janeeer Smith',
  //     email: 'janeda@example.com',
  //     role: 'Student',
  //     id_team: 1,
  //   },
  //   {
  //     id: 11,
  //     name: 'Jane23 Smith',
  //     email: 'janed2@example.com',
  //     role: 'Student',
  //     id_team: 1,
  //   },
  //   {
  //     id: 4,
  //     name: 'Janee Smith',
  //     email: 'janee@example.com',
  //     role: 'Student',
  //     id_team: 2,
  //   },    {
  //     id: 5,
  //     name: 'Janed Smith',
  //     email: 'janeda@example.com',
  //     role: 'Student',
  //     id_team: 2,
  //   },
  //   {
  //     id: 6,
  //     name: 'Janette Smith',
  //     email: 'jane@example.com',
  //     role: 'Student',
  //     id_team: 2,
  //   },
  //   {
  //     id: 7,
  //     name: 'MJane Smith',
  //     email: 'jane@example.com',
  //     role: 'Student',
  //     id_team: 2,
  //   },
  //   {
  //     id: 8,
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     role: 'Student',
  //     id_team: null,
  //   },
  //   {
  //     id: 9,
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     role: 'Student',
  //     id_team: null,
  //   },
  // ];
    
 // constructor() { }
}
