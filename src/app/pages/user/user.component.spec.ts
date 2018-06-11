jest.mock('./services/user.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog } from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.service';
import { UserType } from '../../models/user.model';

describe('dashboard component', () => {
  beforeEach(async () => {

    class UserDialogMock {
      open = jest.fn().mockImplementation(() => {
        return {
          afterClosed: () => {
            return {
              subscribe: jest.fn(),
            };
          },
        };
      });
    }

    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        UserComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
      ],
      providers: [
        UserService,
        { provide: MatDialog, useClass: UserDialogMock },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // shallow = new Shallow(UserComponent, AppModule);
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(UserComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewUser function', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.addNewUser();
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteUser function', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.deleteUser(123, 'sad', 'asd', UserType.MANAGER);
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeUser function', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.updateUser(123, 'sad', 'asd', 'asd', 'asd');
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

});
