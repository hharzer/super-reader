import { NgZone } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigModel } from '../../models';
import { angularFireAuthStub, credentialsMock } from '../../testing/angular-fireauth-stub.spec';
import { angularFirestoreStubNoData } from '../../testing/angular-firestore-stub.spec';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                {provide: AngularFireAuth, useValue: angularFireAuthStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.pageService.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should load config properly', fakeAsync(() => {
        comp.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${comp.locale}`)
            .subscribe(config => {
                comp.configService.init(config);
            });
        tick();
        expect(comp.customHtml.title)
            .toBe('Project is Ready');
    }));

    it('should load config properly even if initialized after already got', fakeAsync(() => {
        comp.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${comp.locale}`)
            .subscribe(config => {
                comp.configService.init(config);
            });
        tick();
        // tslint:disable-next-line:no-lifecycle-call
        comp.ngOnInit();
        tick();
        expect(comp.customHtml.title)
            .toBe('Project is Ready');
    }));

});

describe('HomeComponentNoData', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData},
                {provide: AngularFireAuth, useValue: angularFireAuthStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

});

describe('HomeComponentAuthService', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                {provide: AngularFireAuth, useValue: angularFireAuthStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'dashboard', component: HomeComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should be created', fakeAsync(() => {
        expect(comp.auth)
            .toBeTruthy();
    }));

    it('should not be initially authenticated', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));

    it('should be authenticated after register', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.register(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should be authenticated after logging in', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.logIn(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should be authenticated after googleSignIn()', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.googleSignIn()
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should not be authenticated after logging out', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.logIn(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.debugElement.injector.get(NgZone)
            .run(() => {
                comp.auth.signOut()
                    .catch(reason => {
                        expect(reason)
                            .toBeUndefined();
                    });
            });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));
});
