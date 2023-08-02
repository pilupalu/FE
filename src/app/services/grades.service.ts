import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Grade {
  userID: number;
  activityID: number;
  date: string;
  mentorID: number;
  grade: number;
  comment: string;

  constructor(id_user: number, id_activity: number, date: string, id_mentor: number, grade: number, comment: string) {
    this.userID = id_user;
    this.activityID = id_activity;
    this.date = date;
    this.mentorID = id_mentor;
    this.grade = grade;
    this.comment = comment;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiUrl = 'http://localhost:8080/grades/all';
  private addGradeUrl = "http://localhost:8080/grades/new"
  private grades: Grade[] = [];

  constructor(private http: HttpClient) {
    // Call the loadGrades method during service initialization
    this.loadGrades().subscribe(
      (grades: Grade[]) => {
        this.grades = grades.map((grade: any) => {
          // Here, map the properties accordingly, assuming the API response is in the correct format
          const idUser: number = grade.userID?.id;
          const idActivity: number = grade.activityID?.id;
          const date: string = grade.date;
          const idMentor: number = grade.mentorID;
          const gradeValue: number = grade.grade;
          const comment: string = grade.comment;
          return new Grade(idUser, idActivity, date, idMentor, gradeValue, comment);
        });
        console.log("Grades loaded:", this.grades);
      },
      (error) => {
        console.error('Error loading grades:', error);
      }
    );
  }

  getGradesByActivityAndUser(activityId: number, userId: number): Grade[] {
    return this.grades.filter(
      (grade) => grade.activityID === activityId && grade.userID === userId
    );
  }

  addGrade(id_user: number, id_activity: number, date: string, id_mentor: number, grade: number, comment: string) {
    // Create the grade object with the local structure and push it to the local array
    const newGrade = new Grade(id_user, id_activity, date, id_mentor, grade, comment);
    this.grades.push(newGrade);

    // Create the nested objects for userID and activityID
    const userIdObject = { id: id_user };
    const activityIdObject = { id: id_activity };

    // Modify the newGrade object to match the backend structure
    const userID = userIdObject;
    const activityID = activityIdObject;

    const newNewGrade = {
      userID: userIdObject,
      activityID: activityIdObject,
      date: date,
      mentorID: id_mentor,
      grade: grade,
      comment: comment
    };

    // Send the POST request with the modified payload
    this.http.post(this.addGradeUrl, newNewGrade).subscribe(
      (response: any) => {
        console.log('Grade added:', response);
      },
      (error) => {
        console.error('Error adding grade:', error);
      }
    );
  }
  private loadGrades() {
    return this.http.get<Grade[]>(this.apiUrl);
  }
}
