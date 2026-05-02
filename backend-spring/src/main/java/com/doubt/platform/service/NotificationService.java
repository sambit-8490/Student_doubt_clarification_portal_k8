package com.doubt.platform.service;

import com.doubt.platform.model.Notification;
import com.doubt.platform.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void send(Long userId, String type, String message, Long appointmentId) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setMessage(message);
        n.setAppointmentId(appointmentId);
        notificationRepository.save(n);
    }
}
