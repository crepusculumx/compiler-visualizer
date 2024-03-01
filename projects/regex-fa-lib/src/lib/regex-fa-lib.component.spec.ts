import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegexFaLibComponent } from "./regex-fa-lib.component";

describe("RegexFaLibComponent", () => {
  let component: RegexFaLibComponent;
  let fixture: ComponentFixture<RegexFaLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegexFaLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegexFaLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
