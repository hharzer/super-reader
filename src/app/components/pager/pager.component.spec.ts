import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { PagerComponent } from './pager.component';

describe('PagerComponent', () => {
    let fixture: ComponentFixture<PagerComponent>;
    let comp: PagerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([{path: '', component: PagerComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PagerComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });

    it('destroying should work properly', async(() => {
        comp.subscription.unsubscribe();
        comp.subscription = undefined;
        fixture.detectChanges();
        expect(comp)
            .toBeTruthy();
    }));

});
