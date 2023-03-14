package com.isf6.backend.service;

import com.isf6.backend.api.Request.ReportSaveReqDto;
import com.isf6.backend.domain.entity.Report;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.repository.ReportRepository;
import com.isf6.backend.domain.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;
    @Autowired
    UserRepository userRepository;

    public void saveReport(Long reportedUserCode, ReportSaveReqDto reportSaveReqDto) {
        Report report = new Report();

        User reportedUser = userRepository.findByUserCode(reportedUserCode);
        report.setReported(reportedUser);
        User reporterUser = userRepository.findByUserCode(reportSaveReqDto.getReporter());
        report.setReporter(reporterUser);

        report.setContent(reportSaveReqDto.getContent());
        reportRepository.save(report);
    }
}
