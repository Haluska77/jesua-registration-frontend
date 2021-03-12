import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'user-avatar-list',
  templateUrl: './user-avatar-list.component.html',
  styleUrls: ['./user-avatar-list.component.css']
})
export class UserAvatarListComponent{

  constructor(public dialogRef: MatDialogRef<UserAvatarListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  avatars = ['001-default.svg', '002-athlete.svg', '003-boy-1.svg', '004-arab-man.svg',
    '005-woman-1.svg', '006-dancer.svg', '007-joker.svg', '008-man-5.svg', '009-arab-woman.svg',
  '010-student.svg', '011-priest.svg', '012-pirate.svg', '013-sumo.svg', '014-clown.svg',
  '015-woman.svg', '016-boy.svg', '017-santa-claus.svg', '018-gentleman.svg', '019-graduated.svg',
  '020-welder.svg', '021-pilot.svg', '022-sailor.svg', '024-viking.svg', '025-hipster.svg',
  '026-heisenberg.svg', '027-militar.svg', '028-maid.svg', '029-disc-jockey.svg', '030-firefighter.svg',
  '031-nurse.svg', '032-witch.svg', '034-pirate.svg', '035-man-4.svg', '036-knight.svg', '037-phone-operator.svg',
  '038-concierge.svg', '039-engineering.svg', '040-farmer.svg', '041-boxer.svg', '042-hunter.svg',
  '043-mariachi.svg', '044-man-3.svg', '045-jockey.svg', '046-elf.svg', '047-girl.svg', '048-cashier.svg',
  '049-diver.svg', '050-surgeon.svg', '051-man-2.svg', '052-chef.svg', '053-grandmother.svg',
  '054-stewardess.svg', '055-man-1.svg', '056-angel.svg', '057-bandit.svg', '058-policeman.svg',
  '059-nun.svg', '060-man.svg'];

  select(avatar: string): void {
    this.dialogRef.close(avatar);
  }
}
