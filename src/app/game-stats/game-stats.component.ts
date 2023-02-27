import { Component } from '@angular/core';
import {Division, Team} from '../data.models';
import {combineLatest, map, Observable, of, tap} from 'rxjs';
import {NbaService} from '../nba.service';


@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent {

  teams$: Observable<Team[]>;
  allTeams: Team[] = [];
  division$: Observable<Division[]> = of();
  defaultSelectDay = '';
  daysChoice = ['6','12','20']

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService.getAllTeams().pipe(
      tap(data => this.allTeams = data)
    );
    this.division$ = nbaService.getAllDivisions();
    this.nbaService.numberOfDays.asObservable().subscribe(value => {
      this.defaultSelectDay = value;
    })
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team)
      this.nbaService.addTrackedTeam(team);
  }

  selectedConfEvent(event: string){
     this.division$ = this.nbaService.getAllDivisions();
     this.teams$ = of(this.allTeams);

    let obs = combineLatest(event, this.teams$, this.division$).
    pipe(map(value => {
      return [value[1].filter(team => team.conference.includes(event.replace('ern', ''))) as unknown as Team[],
        value[2].filter(div => div.conferenceName.includes(event))]
      }))

    this.teams$ = obs.pipe(map(value => value[0] as unknown as Team[]));
    this.division$ = obs.pipe(map(value => value[1] as unknown as Division[]));
  }

  selectedDivEvent(event: string){
    this.teams$ = of(this.allTeams);
    this.teams$ = combineLatest(event, this.teams$).pipe(map(value => {
      return value[1].filter(team =>{
        return  team.division.includes(event.split(' ')[0]);
      });
    }))
  }

  selectedNumberOfDays(value: string) {
    this.nbaService.numberOfDays.next(value);
  }
}
