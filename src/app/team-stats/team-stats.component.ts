import {Component, Input, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {

  @Input()
  team!: Team;

  games$!: Observable<Game[]>;
  stats!: Stats;
  showPopup = false;
  numbersOfDays = 0;

  constructor(protected nbaService: NbaService) { }

  ngOnInit(): void {
    this.nbaService.numberOfDays.asObservable().subscribe(value => {
      this.initGames(Number(value));
    })
  }

  deleteTeam(value: string) {
    if(value === "Yes"){
      this.nbaService.removeTrackedTeam(this.team);
    }
    this.showPopup = false;
  }

  initGames(numberOfDays:number){
    this.numbersOfDays = numberOfDays;
    this.games$ = this.nbaService.getLastResults(this.team, numberOfDays).pipe(
      tap(games =>  this.stats = this.nbaService.getStatsFromGames(games, this.team))
    )
  }


}
